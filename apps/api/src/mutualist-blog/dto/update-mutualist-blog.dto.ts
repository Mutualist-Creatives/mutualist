import { PartialType } from '@nestjs/mapped-types';
import { CreateMutualistBlogDto } from './create-mutualist-blog.dto';

export class UpdateMutualistBlogDto extends PartialType(
  CreateMutualistBlogDto,
) {}
