import { Module } from '@nestjs/common';
import { MainPortfolioService } from './main-portfolio.service';
import { MainPortfolioController } from './main-portfolio.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [MainPortfolioController],
  providers: [MainPortfolioService],
})
export class MainPortfolioModule {}
