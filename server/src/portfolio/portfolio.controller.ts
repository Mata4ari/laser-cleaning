import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  findAll(@Req() req: Request) {
    console.log("Incoming request headers:", req.headers);
    console.log("Incoming request URL:", req.url);
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

  @Post()
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    const item = this.portfolioService.update(+id, updatePortfolioDto);
    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }
    return item;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.portfolioService.remove(+id)) {
      throw new NotFoundException('Portfolio item not found');
    }
    return { message: 'Portfolio item deleted successfully' };
  }
}
