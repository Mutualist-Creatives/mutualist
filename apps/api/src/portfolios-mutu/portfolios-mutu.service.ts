import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreatePortfolioMutuDto } from './dto/create-portfolio-mutu.dto';
import { UpdatePortfolioMutuDto } from './dto/update-portfolio-mutu.dto';

@Injectable()
export class PortfoliosMutuService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createPortfolioMutuDto: CreatePortfolioMutuDto) {
    return this.prisma.portfolioMutu.create({
      data: createPortfolioMutuDto,
    });
  }

  async findAll() {
    return this.prisma.portfolioMutu.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const portfolio = await this.prisma.portfolioMutu.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio Mutu with ID ${id} not found`);
    }

    return portfolio;
  }

  async findBySlug(slug: string) {
    const portfolio = await this.prisma.portfolioMutu.findUnique({
      where: { slug },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio Mutu with slug ${slug} not found`);
    }

    return portfolio;
  }

  async update(id: string, updatePortfolioMutuDto: UpdatePortfolioMutuDto) {
    const existingPortfolio = await this.findOne(id);

    if (updatePortfolioMutuDto.images) {
      const oldImages = existingPortfolio.images || [];
      const newImages = updatePortfolioMutuDto.images;

      const imagesToDelete = oldImages.filter(
        (oldImg: string) => !newImages.includes(oldImg),
      );

      if (imagesToDelete.length > 0) {
        await this.uploadService.deleteMultipleFiles(imagesToDelete);
      }
    }

    return this.prisma.portfolioMutu.update({
      where: { id },
      data: updatePortfolioMutuDto,
    });
  }

  async remove(id: string) {
    const portfolio = await this.findOne(id);

    if (portfolio.images && portfolio.images.length > 0) {
      try {
        console.log(
          `Deleting ${portfolio.images.length} images for portfolio mutu ${id}`,
        );
        await this.uploadService.deleteMultipleFiles(portfolio.images);
        console.log('Images deletion attempted');
      } catch (error) {
        console.error('Failed to delete some images from storage:', error);
        console.log('Continuing with portfolio deletion anyway');
      }
    }

    try {
      await this.prisma.portfolioMutu.delete({
        where: { id },
      });
      console.log(`Portfolio Mutu ${id} deleted successfully`);
      return { success: true, message: 'Portfolio Mutu deleted successfully' };
    } catch (error) {
      console.error('Failed to delete portfolio mutu from database:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete portfolio mutu: ${errorMessage}`);
    }
  }
}
