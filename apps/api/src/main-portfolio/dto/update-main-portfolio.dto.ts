import { PartialType } from '@nestjs/mapped-types';
import { CreateMainPortfolioDto } from './create-main-portfolio.dto';

export class UpdateMainPortfolioDto extends PartialType(
  CreateMainPortfolioDto,
) {}
