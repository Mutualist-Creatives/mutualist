import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateLifeProjectDto } from './dto/create-life-project.dto';
import { UpdateLifeProjectDto } from './dto/update-life-project.dto';

@Injectable()
export class LifeProjectService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createProjectDto: CreateLifeProjectDto) {
    return this.prisma.lifeProject.create({
      data: createProjectDto,
    });
  }

  async findAll() {
    return this.prisma.lifeProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.lifeProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateLifeProjectDto) {
    const existingProject = await this.findOne(id);

    // If images are being updated, delete old images that are not in the new list
    if (updateProjectDto.images) {
      const oldImages = existingProject.images || [];
      const newImages = updateProjectDto.images;

      const imagesToDelete = oldImages.filter(
        (oldImg: string) => !newImages.includes(oldImg),
      );

      if (imagesToDelete.length > 0) {
        await this.uploadService.deleteMultipleFiles(imagesToDelete);
      }
    }

    return this.prisma.lifeProject.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string) {
    const project = await this.findOne(id);

    // Delete images from storage first (best effort)
    if (project.images && project.images.length > 0) {
      try {
        console.log(
          `Deleting ${project.images.length} images for project ${id}`,
        );
        await this.uploadService.deleteMultipleFiles(project.images);
        console.log('Images deletion attempted');
      } catch (error) {
        console.error('Failed to delete some images from storage:', error);
        console.log('Continuing with project deletion anyway');
      }
    }

    try {
      await this.prisma.lifeProject.delete({
        where: { id },
      });
      console.log(`Project ${id} deleted successfully`);
      return { success: true, message: 'Project deleted successfully' };
    } catch (error) {
      console.error('Failed to delete project from database:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete project: ${errorMessage}`);
    }
  }

  async getCategories() {
    const projects = await this.prisma.lifeProject.findMany({
      select: { categories: true },
    });

    const allCategories = projects.flatMap(
      (p: { categories: string[] }) => p.categories || [],
    );
    const categories = [...new Set(allCategories)];
    return categories;
  }
}
