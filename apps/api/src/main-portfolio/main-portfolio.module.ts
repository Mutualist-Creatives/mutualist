import { Module } from '@nestjs/common';
import { MainPortfolioService } from './main-portfolio.service';
import { MainPortfolioController } from './main-portfolio.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MainPortfolioController],
  providers: [MainPortfolioService],
})
export class MainPortfolioModule {}
