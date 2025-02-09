import { Module } from '@nestjs/common';

import { PostService } from './dto/services/post.service';
import { PostController } from './post.controller';

@Module({
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
