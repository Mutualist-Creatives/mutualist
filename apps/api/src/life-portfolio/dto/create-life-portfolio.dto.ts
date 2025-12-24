import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateLifePortfolioDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
