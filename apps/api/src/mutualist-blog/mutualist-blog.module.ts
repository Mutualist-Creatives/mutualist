import { Module } from '@nestjs/common';
import { MutualistBlogService } from './mutualist-blog.service';
import { MutualistBlogController } from './mutualist-blog.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [MutualistBlogController],
  providers: [MutualistBlogService],
})
export class MutualistBlogModule {}
