import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMutualistBlogDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  rotation?: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
