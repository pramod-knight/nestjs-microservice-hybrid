import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostModuleDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(0)
  post_images: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  created_by: string;
}
