import { Module } from '@nestjs/common';
import { PortfoliosMutuService } from './portfolios-mutu.service';
import { PortfoliosMutuController } from './portfolios-mutu.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [PortfoliosMutuController],
  providers: [PortfoliosMutuService],
})
export class PortfoliosMutuModule {}
