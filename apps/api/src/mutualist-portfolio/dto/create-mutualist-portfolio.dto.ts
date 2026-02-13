import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateMutualistPortfolioDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsArray()
  @IsString({ each: true })
  serviceIcons: string[];

  @IsString()
  @IsNotEmpty()
  serviceNames: string;

  @IsArray()
  @IsOptional()
  teams: any;

  @IsArray()
  @IsOptional()
  content: any;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
