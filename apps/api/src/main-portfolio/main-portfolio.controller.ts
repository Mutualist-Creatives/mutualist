import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MainPortfolioService } from './main-portfolio.service';
import { CreateMainPortfolioDto } from './dto/create-main-portfolio.dto';
import { UpdateMainPortfolioDto } from './dto/update-main-portfolio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('main-portfolios')
export class MainPortfolioController {
  constructor(private readonly mainPortfolioService: MainPortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMainPortfolioDto: CreateMainPortfolioDto) {
    return this.mainPortfolioService.create(createMainPortfolioDto);
  }

  @Get()
  findAll() {
    return this.mainPortfolioService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.mainPortfolioService.findOne(slug);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('slug') slug: string,
    @Body() updateMainPortfolioDto: UpdateMainPortfolioDto,
  ) {
    return this.mainPortfolioService.update(slug, updateMainPortfolioDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  remove(@Param('slug') slug: string) {
    return this.mainPortfolioService.remove(slug);
  }
}
