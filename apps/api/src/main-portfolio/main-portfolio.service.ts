import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateMainPortfolioDto } from './dto/create-main-portfolio.dto';
import { UpdateMainPortfolioDto } from './dto/update-main-portfolio.dto';

@Injectable()
export class MainPortfolioService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMainPortfolioDto) {
    try {
      return await this.prisma.mainPortfolio.create({ data });
    } catch (e) {
      console.error('Error creating portfolio:', e);
      // Check for Prisma unique constraint violation (P2002)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new HttpException(
            `Portfolio with this slug already exists`,
            HttpStatus.CONFLICT,
          );
        }
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      throw new HttpException(
        `Failed to create portfolio: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.mainPortfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(slug: string) {
    return this.prisma.mainPortfolio.findUnique({
      where: { slug },
    });
  }

  async update(slug: string, data: UpdateMainPortfolioDto) {
    try {
      return await this.prisma.mainPortfolio.update({
        where: { slug },
        data,
      });
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  async remove(slug: string) {
    try {
      return await this.prisma.mainPortfolio.delete({
        where: { slug },
      });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }
}
