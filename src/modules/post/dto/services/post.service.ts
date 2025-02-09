import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';

import { PostUpdateDto } from '../req/post.update.dto';
import { BasePostResponseDto } from '../res/base.post.response.dto';
import { PostRepository } from '../../../repository/services/post.repository';
import { PostCreateDto } from '../req/post.create.dto';
import { IUserData } from '../../../auth/interfaces/user.data.interface';
import { PostMapper } from './post.mapper';
import { PostEntity } from '../../../../database/entities/post.entity';
import { PostCategory } from '../../../../database/entities/enums/post.category.enum';
import { PostQueryDto } from '../req/post.query.dto';
import { PaginatedDto } from '../../../../common/common.dto/paginated.response.dto';
import { SortOrder } from '../../../../common/common.dto/base.query.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  public async createPost(
    userData: IUserData,
    dto: PostCreateDto,
  ): Promise<BasePostResponseDto> {
    if (!Object.values(PostCategory).includes(dto.category as PostCategory)) {
      throw new BadRequestException('Invalid category');
    }

    const newPost = this.postRepository.create({
      ...dto,
      category: dto.category as PostCategory,
      userId: userData.userId,
    });

    const savedPost = await this.postRepository.save(newPost);
    const fullPost = await this.postRepository.findWithUserById(savedPost.id);
    return PostMapper.toPostResponseDTO(fullPost);
  }

  public async getAllPosts(
    query?: PostQueryDto,
  ): Promise<PaginatedDto<BasePostResponseDto>> {
    const options = {
      page: +query?.page || 1,
      limit: +query?.limit || 10,
      order: query?.order || SortOrder.ASC,
    };

    const queryBuilder = this.postRepository.buildPostQuery();
    queryBuilder.orderBy('post.createdAt', options.order);

    const [pagination, rawEntities] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );
    const posts = rawEntities.map((post) =>
      PostMapper.toPostResponseDTO(post as PostEntity),
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItems: pagination.meta.totalItems,
      entities: posts,
    };
  }

  public async getUserPosts(
    userId: string,
    query?: PostQueryDto,
  ): Promise<PaginatedDto<BasePostResponseDto>> {
    const options = {
      page: +query?.page || 1,
      limit: +query?.limit || 10,
      order: query?.order || SortOrder.ASC,
    };

    const queryBuilder = this.postRepository
      .buildPostQuery()
      .where('post.userId = :userId', { userId });
    queryBuilder.orderBy('post.createdAt', options.order);

    const [pagination, rawEntities] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );
    const posts = rawEntities.map((post) =>
      PostMapper.toPostResponseDTO(post as PostEntity),
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItems: pagination.meta.totalItems,
      entities: posts,
    };
  }

  public async getPostById(postId: string): Promise<BasePostResponseDto> {
    const post = await this.postRepository.findWithUserById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return PostMapper.toPostResponseDTO(post);
  }

  public async updatePost(
    userData: IUserData,
    postId: string,
    dto: PostUpdateDto,
  ): Promise<BasePostResponseDto> {
    const post = await this.findMyPost(userData.userId, postId);
    const updatedPost = await this.postRepository.updatePostData(post, dto);
    return PostMapper.toPostResponseDTO(updatedPost);
  }

  public async deletePost(userData: IUserData, postId: string): Promise<void> {
    await this.findMyPost(userData.userId, postId);
    await this.postRepository.deleteById(postId);
  }

  private async findMyPost(
    userId: string,
    postId: string,
  ): Promise<PostEntity> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }
    return post;
  }
}
