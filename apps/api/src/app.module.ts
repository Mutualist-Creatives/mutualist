import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { LifeProjectModule } from './life-project/life-project.module';
import { UploadModule } from './upload/upload.module';
import { MutualistPortfolioModule } from './mutualist-portfolio/mutualist-portfolio.module';
import { MutualistBlogModule } from './mutualist-blog/mutualist-blog.module';
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
    LifeProjectModule,
    UploadModule,
    MutualistPortfolioModule,
    MutualistBlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
