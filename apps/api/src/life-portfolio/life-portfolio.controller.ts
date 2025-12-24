import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LifePortfolioService } from './life-portfolio.service';
import { CreateLifePortfolioDto } from './dto/create-life-portfolio.dto';
import { UpdateLifePortfolioDto } from './dto/update-life-portfolio.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('life-portfolios')
export class LifePortfolioController {
  constructor(private readonly portfolioService: LifePortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  create(@Body() createPortfolioDto: CreateLifePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @Get('categories')
  getCategories() {
    return this.portfolioService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdateLifePortfolioDto,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(id);
  }
}
