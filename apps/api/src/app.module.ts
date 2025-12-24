import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
