import { Module } from '@nestjs/common';
import { MutualistPortfolioService } from './mutualist-portfolio.service';
import { MutualistPortfolioController } from './mutualist-portfolio.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [MutualistPortfolioController],
  providers: [MutualistPortfolioService],
})
export class MutualistPortfolioModule {}
