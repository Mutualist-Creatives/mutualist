import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { LifePortfolioModule } from './life-portfolio/life-portfolio.module';
import { UploadModule } from './upload/upload.module';
import { MainPortfolioModule } from './main-portfolio/main-portfolio.module';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    LifePortfolioModule,
    UploadModule,
    MainPortfolioModule,
    BlogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
