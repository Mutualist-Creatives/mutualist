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
import { MutualistBlogService } from './mutualist-blog.service';
import { CreateMutualistBlogDto } from './dto/create-mutualist-blog.dto';
import { UpdateMutualistBlogDto } from './dto/update-mutualist-blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mutualist-blogs')
export class MutualistBlogController {
  constructor(private readonly blogService: MutualistBlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateMutualistBlogDto) {
    return this.blogService.create(createDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateMutualistBlogDto,
  ) {
    return this.blogService.update(slug, updateDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  remove(@Param('slug') slug: string) {
    return this.blogService.remove(slug);
  }
}
