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
import { MutualistPortfolioService } from './mutualist-portfolio.service';
import { CreateMutualistPortfolioDto } from './dto/create-mutualist-portfolio.dto';
import { UpdateMutualistPortfolioDto } from './dto/update-mutualist-portfolio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mutualist-portfolios')
export class MutualistPortfolioController {
  constructor(private readonly portfolioService: MutualistPortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateMutualistPortfolioDto) {
    return this.portfolioService.create(createDto);
  }

  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.portfolioService.findOne(slug);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateMutualistPortfolioDto,
  ) {
    return this.portfolioService.update(slug, updateDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  remove(@Param('slug') slug: string) {
    return this.portfolioService.remove(slug);
  }
}
