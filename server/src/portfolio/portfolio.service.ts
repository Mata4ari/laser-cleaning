import { Injectable } from '@nestjs/common';
import { Portfolio } from './dto/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { promisify } from 'util';
import { Multer } from 'multer';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class PortfolioService {
  private readonly dataPath = path.join(__dirname, '../../data/portfolio.json');
  private readonly uploadsPath = path.join(__dirname, '../../uploads');

  constructor() {
    this.ensureUploadsDirectoryExists();
  }

  private async ensureUploadsDirectoryExists(): Promise<void> {
    try {
      await mkdirAsync(this.uploadsPath, { recursive: true });
    } catch (err) {
      console.error('Failed to create uploads directory:', err);
    }
  }

  private async readData(): Promise<Portfolio[]> {
    try {
      const data = await readFileAsync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await writeFileAsync(this.dataPath, JSON.stringify([], null, 2));
        return [];
      }
      throw err;
    }
  }

  private async writeData(data: Portfolio[]): Promise<void> {
    await writeFileAsync(this.dataPath, JSON.stringify(data, null, 2), 'utf8');
  }

  private async saveImage(file: Express.Multer.File): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuid.v4()}${fileExt}`;
    const filePath = path.join(this.uploadsPath, fileName);


    await writeFileAsync(filePath, file.buffer);
    return `/uploads/${fileName}`;
  }

  private async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    const fileName = path.basename(imageUrl);
    const filePath = path.join(this.uploadsPath, fileName);

    try {
      await unlinkAsync(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Failed to delete image:', err);
      }
    }
  }

  async findAll(): Promise<Portfolio[]> {
    return this.readData();
  }

  async findOne(id: number): Promise<Portfolio | undefined> {
    const items = await this.readData();
    return items.find((item) => item.id === id);
  }

  async create(
    createPortfolioDto: CreatePortfolioDto,
    imageFile?: Express.Multer.File,
  ): Promise<Portfolio> {
    const items = await this.readData();
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    //console.log('POST')
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await this.saveImage(imageFile);
    }

    const newItem: Portfolio = {
      id: newId,
      title: createPortfolioDto.title,
      description: createPortfolioDto.description,
      imageUrl,
    };

    items.push(newItem);
    await this.writeData(items);
    return newItem;
  }

  async update(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    imageFile?: Express.Multer.File,
  ): Promise<Portfolio | null> {
    const items = await this.readData();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    let imageUrl = items[index].imageUrl;
    if (imageFile) {
      // Удаляем старое изображение если оно было
      if (imageUrl) {
        await this.deleteImage(imageUrl);
      }
      imageUrl = await this.saveImage(imageFile);
    }

    const updatedItem: Portfolio = {
      ...items[index],
      title: updatePortfolioDto.title || items[index].title,
      description: updatePortfolioDto.description || items[index].description,
      imageUrl: imageUrl || items[index].imageUrl,
    };

    items[index] = updatedItem;
    await this.writeData(items);
    return updatedItem;
  }

  async remove(id: number): Promise<boolean> {
    const items = await this.readData();
    const itemToDelete = items.find((item) => item.id === id);

    if (!itemToDelete) {
      return false;
    }

    // Удаляем связанное изображение
    if (itemToDelete.imageUrl) {
      await this.deleteImage(itemToDelete.imageUrl);
    }

    const newItems = items.filter((item) => item.id !== id);
    await this.writeData(newItems);
    return true;
  }
}