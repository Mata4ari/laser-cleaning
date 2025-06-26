import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { Request } from 'express';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  findAll(@Req() req: Request) {
    console.log("Incoming request headers:", req.headers);
    return this.portfolioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const item = this.portfolioService.findOne(+id);
    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }
    return item;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image')) 
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.portfolioService.create(createPortfolioDto, image);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const item = this.portfolioService.update(+id, updatePortfolioDto, image);
    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }
    return item;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.portfolioService.remove(+id)) {
      throw new NotFoundException('Portfolio item not found');
    }
    return { message: 'Portfolio item deleted successfully' };
  }
}