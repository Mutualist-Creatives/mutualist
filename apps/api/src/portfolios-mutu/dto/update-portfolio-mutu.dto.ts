import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioMutuDto } from './create-portfolio-mutu.dto';

export class UpdatePortfolioMutuDto extends PartialType(
  CreatePortfolioMutuDto,
) {}
