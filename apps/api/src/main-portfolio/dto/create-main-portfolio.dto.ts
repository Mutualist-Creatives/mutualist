import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateMainPortfolioDto {
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
  // Note: Since 'teams' is Json in Prisma, we validate it here but passing it to Prisma requires compatibility.
  // We can enforce structure here.
  teams: any;

  @IsArray()
  @IsOptional()
  content: any;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
