import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { PostCategory } from '../../../../database/entities/enums/post.category.enum';

export class PostUpdateDto {
  @ApiProperty({
    example: 'Updated Post Title',
    description: 'Title of the post',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(TransformHelper.trim)
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(80, { message: 'Title can be at most 80 characters long' })
  public readonly title?: string;

  @ApiProperty({
    example: 'This is the updated content of the post...',
    description: 'Content of the post',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(TransformHelper.trim)
  @MinLength(1, { message: 'Content must be at least 1 characters long' })
  @MaxLength(600, { message: 'Content can be at most 600 characters long' })
  public readonly content?: string;

  @ApiProperty({
    example: 'Technology',
    description: 'Category of the post',
    required: false,
    enum: PostCategory,
  })
  @IsEnum(PostCategory, { message: 'Invalid category' })
  @IsOptional()
  public readonly category?: PostCategory;
}
