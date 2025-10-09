import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async create(createPortfolioDto: CreatePortfolioDto) {
    return this.prisma.portfolio.create({
      data: createPortfolioDto,
    });
  }

  async findAll() {
    return this.prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.portfolio.update({
      where: { id },
      data: updatePortfolioDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }

  async getCategories() {
    const portfolios = await this.prisma.portfolio.findMany({
      select: { category: true },
    });

    const categories = [...new Set(portfolios.map((p) => p.category))];
    return categories;
  }
}
