import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PostEntity } from '../../../database/entities/post.entity';
import { PostUpdateDto } from '../../post/dto/req/post.update.dto';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostEntity, dataSource.manager);
  }

  async findWithUserById(postId: string): Promise<PostEntity | null> {
    return this.findOne({ where: { id: postId }, relations: ['user'] });
  }

  buildPostQuery() {
    return this.createQueryBuilder('post')
      .select([
        'post.id as "id"',
        'post.title as "title"',
        'post.content as "content"',
        'post.category as "category"',
        'post.likes as "likes"',
        'post.views as "views"',
        'post.commentsCount as "commentsCount"',
        'post.createdAt as "createdAt"',
        'post.updatedAt as "updatedAt"',
      ])
      .leftJoin('post.user', 'user')
      .addSelect([
        'user.id as "userId"',
        'user.firstName as "firstName"',
        'user.lastName as "lastName"',
        'user.email as "email"',
        'user.city as "city"',
      ]);
  }

  async updatePostData(
    post: PostEntity,
    dto: PostUpdateDto,
  ): Promise<PostEntity> {
    const updatedPost = this.create({ ...post, ...dto, updatedAt: new Date() });
    await this.save(updatedPost);

    return this.findOne({
      where: { id: post.id },
      relations: ['user'],
    });
  }

  async deleteById(postId: string): Promise<void> {
    await this.delete(postId);
  }

  async findById(postId: string): Promise<PostEntity | null> {
    return this.findOne({ where: { id: postId } });
  }
}
