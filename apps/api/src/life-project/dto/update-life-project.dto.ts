import { PartialType } from '@nestjs/mapped-types';
import { CreateLifeProjectDto } from './create-life-project.dto';

export class UpdateLifeProjectDto extends PartialType(CreateLifeProjectDto) {}
