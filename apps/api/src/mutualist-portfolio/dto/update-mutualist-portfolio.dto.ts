import { PartialType } from '@nestjs/mapped-types';
import { CreateMutualistPortfolioDto } from './create-mutualist-portfolio.dto';

export class UpdateMutualistPortfolioDto extends PartialType(
  CreateMutualistPortfolioDto,
) {}
