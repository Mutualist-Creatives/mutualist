import { Module } from '@nestjs/common';
import { LifePortfolioService } from './life-portfolio.service';
import { LifePortfolioController } from './life-portfolio.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [LifePortfolioController],
  providers: [LifePortfolioService],
})
export class LifePortfolioModule {}
