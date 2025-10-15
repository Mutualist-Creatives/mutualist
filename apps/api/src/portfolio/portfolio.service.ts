import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

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
    const existingPortfolio = await this.findOne(id); // Check if exists

    // If images are being updated, delete old images that are not in the new list
    if (updatePortfolioDto.images) {
      const oldImages = existingPortfolio.images || [];
      const newImages = updatePortfolioDto.images;

      // Find images that are being removed
      const imagesToDelete = oldImages.filter(
        (oldImg: string) => !newImages.includes(oldImg),
      );

      // Delete removed images from storage
      if (imagesToDelete.length > 0) {
        await this.uploadService.deleteMultipleFiles(imagesToDelete);
      }
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: updatePortfolioDto,
    });
  }

  async remove(id: string) {
    const portfolio = await this.findOne(id); // Check if exists

    // Delete images from Supabase storage first
    if (portfolio.images && portfolio.images.length > 0) {
      try {
        console.log(
          `Deleting ${portfolio.images.length} images for portfolio ${id}`,
        );
        await this.uploadService.deleteMultipleFiles(portfolio.images);
        console.log('Images deleted successfully');
      } catch (error) {
        console.error('Failed to delete images from storage:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        throw new Error(
          `Failed to delete images from storage: ${errorMessage}`,
        );
      }
    }

    // Delete portfolio from database
    return this.prisma.portfolio.delete({
      where: { id },
    });
  }

  async getCategories() {
    const portfolios = await this.prisma.portfolio.findMany({
      select: { category: true },
    });

    const categories = [
      ...new Set(portfolios.map((p: { category: string }) => p.category)),
    ];
    return categories;
  }
}
