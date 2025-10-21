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
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
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
  // @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(id);
  }
}
