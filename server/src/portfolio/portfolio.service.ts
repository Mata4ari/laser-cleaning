import { Injectable } from '@nestjs/common';
import { Portfolio } from './dto/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PortfolioService {
  private readonly dataPath = path.join(__dirname, '../../data/portfolio.json');

  private readData(): Portfolio[] {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  private writeData(data: Portfolio[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2), 'utf8');
  }

  findAll(): Portfolio[] {
    console.log("READING DATA");
    return this.readData();
  }

  findOne(id: number): Portfolio | undefined {
    const items = this.readData();
    return items.find((item) => item.id === id);
  }

  create(createPortfolioDto: CreatePortfolioDto): Portfolio {
    const items = this.readData();
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem = { id: newId, ...createPortfolioDto };
    this.writeData([...items, newItem]);
    return newItem;
  }

  update(id: number, updatePortfolioDto: UpdatePortfolioDto): Portfolio | null {
    const items = this.readData();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const updatedItem = { ...items[index], ...updatePortfolioDto };
    items[index] = updatedItem;
    this.writeData(items);
    return updatedItem;
  }

  remove(id: number): boolean {
    const items = this.readData();
    const newItems = items.filter((item) => item.id !== id);
    this.writeData(newItems);
    return newItems.length !== items.length;
  }
}
