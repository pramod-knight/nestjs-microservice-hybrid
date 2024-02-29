import { PartialType } from '@nestjs/mapped-types';
import { CreatePostModuleDto } from './create-post-module.dto';

export class UpdatePostModuleDto extends PartialType(CreatePostModuleDto) {
  id: number;
}
