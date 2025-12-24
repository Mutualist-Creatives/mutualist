import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePortfolioDto {
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
  @IsNotEmpty()
  categories: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
