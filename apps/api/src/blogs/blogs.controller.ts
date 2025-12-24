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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthGuard)
  update(@Param('slug') slug: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(slug, updateBlogDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  remove(@Param('slug') slug: string) {
    return this.blogsService.remove(slug);
  }
}
