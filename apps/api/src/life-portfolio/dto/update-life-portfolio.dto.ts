import { PartialType } from '@nestjs/mapped-types';
import { CreateLifePortfolioDto } from './create-life-portfolio.dto';

export class UpdateLifePortfolioDto extends PartialType(
  CreateLifePortfolioDto,
) {}
