import { PostEntity } from '../../../../database/entities/post.entity';
import { BasePostResponseDto } from '../res/base.post.response.dto';
import { UserMapper } from '../../../user/services/user.mapper';

export class PostMapper {
  public static toPostResponseDTO(post: PostEntity | any): BasePostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      likes: post.likes,
      views: post.views,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user
        ? UserMapper.toShortResponseDTO(post.user)
        : post.userId
          ? {
              id: post.userId,
              firstName: post.firstName,
              lastName: post.lastName,
              email: post.email,
              city: post.city,
            }
          : null,
    };
  }
}
