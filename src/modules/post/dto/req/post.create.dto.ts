import { BasePostRequestDto } from './base.post.request.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PostCreateDto extends PartialType(
  PickType(BasePostRequestDto, ['title', 'content', 'category'] as const),
) {}
