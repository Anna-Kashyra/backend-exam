import { ApiProperty } from '@nestjs/swagger';
import { ShortUserResponseDto } from '../../../user/dto/res/public.user.response.dto';

export class BasePostResponseDto {
  @ApiProperty({
    example: 'f063e460-1cb8-4b44-8376-d3ca655798cd',
    description: 'The id of the Post',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'My First Post',
    description: 'Title of the post',
  })
  public readonly title: string;

  @ApiProperty({
    example: 'This is the content of the post...',
    description: 'Content of the post',
  })
  public readonly content: string;

  @ApiProperty({
    example: 'Technology',
    description: 'Category of the post',
  })
  public readonly category: string;

  @ApiProperty({
    example: 0,
    description: 'Number of likes for the post',
    required: false,
  })
  public readonly likes?: number;

  @ApiProperty({
    example: 0,
    description: 'Number of views for the post',
    required: false,
  })
  public readonly views?: number;

  @ApiProperty({
    example: 0,
    description: 'Number of comments for the post',
    required: false,
  })
  public readonly commentsCount?: number;

  @ApiProperty({
    example: '2025-01-21T15:00:00.000Z',
    description: 'Date when the post was published',
    required: false,
  })
  public readonly createdAt?: Date;

  @ApiProperty({
    example: '2025-01-21T15:00:00.000Z',
    description: 'Date when the post was published',
    required: false,
  })
  public readonly updatedAt?: Date;

  @ApiProperty({
    description: 'Information about the user who created the post',
    type: ShortUserResponseDto,
    required: false,
  })
  public readonly user?: ShortUserResponseDto;
}
