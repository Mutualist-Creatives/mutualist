import {
  IsString,
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePortfolioMutuDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsArray()
  @IsNotEmpty()
  services: Array<{
    advertisement?: boolean;
    branding?: boolean;
    'character design'?: boolean;
    'social media'?: boolean;
  }>;

  @IsArray()
  @IsNotEmpty()
  teams: Array<{
    role: string;
    name: string;
  }>;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  images: string[];
}
