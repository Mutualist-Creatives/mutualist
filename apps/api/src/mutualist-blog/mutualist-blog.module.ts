import { Module } from '@nestjs/common';
import { MutualistBlogService } from './mutualist-blog.service';
import { MutualistBlogController } from './mutualist-blog.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MutualistBlogController],
  providers: [MutualistBlogService],
})
export class MutualistBlogModule {}
