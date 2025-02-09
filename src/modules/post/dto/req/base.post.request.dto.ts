import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { PostCategory } from '../../../../database/entities/enums/post.category.enum';

export class BasePostRequestDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'Title of the post',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(TransformHelper.trim)
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(80, { message: 'Title can be at most 80 characters long' })
  public readonly title: string;

  @ApiProperty({
    example: 'This is the content of the post...',
    description: 'Content of the post',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(TransformHelper.trim)
  @MinLength(1, { message: 'Content must be at least 1 characters long' })
  @MaxLength(600, { message: 'Content can be at most 600 characters long' })
  public readonly content: string;

  @ApiProperty({
    example: 'Technology',
    description: 'Category of the post',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PostCategory, {
    message: `Category must be one of: ${Object.values(PostCategory).join(', ')}`,
  })
  public readonly category: string;

  @ApiProperty({
    example: 0,
    description: 'Number of likes for the post',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  public readonly likes?: number;

  @ApiProperty({
    example: 0,
    description: 'Number of views for the post',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  public readonly views?: number;

  @ApiProperty({
    example: 0,
    description: 'Number of comments for the post',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  public readonly commentsCount?: number;
}
