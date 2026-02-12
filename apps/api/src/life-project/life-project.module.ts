import { Module } from '@nestjs/common';
import { LifeProjectService } from './life-project.service';
import { LifeProjectController } from './life-project.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [LifeProjectController],
  providers: [LifeProjectService],
})
export class LifeProjectModule {}
