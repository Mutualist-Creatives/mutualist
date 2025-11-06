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
import { PortfoliosMutuService } from './portfolios-mutu.service';
import { CreatePortfolioMutuDto } from './dto/create-portfolio-mutu.dto';
import { UpdatePortfolioMutuDto } from './dto/update-portfolio-mutu.dto';

@Controller('portfolios-mutu')
export class PortfoliosMutuController {
  constructor(private readonly portfoliosMutuService: PortfoliosMutuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPortfolioMutuDto: CreatePortfolioMutuDto) {
    return this.portfoliosMutuService.create(createPortfolioMutuDto);
  }

  @Get()
  findAll() {
    return this.portfoliosMutuService.findAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.portfoliosMutuService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfoliosMutuService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioMutuDto: UpdatePortfolioMutuDto,
  ) {
    return this.portfoliosMutuService.update(id, updatePortfolioMutuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.portfoliosMutuService.remove(id);
  }
}
