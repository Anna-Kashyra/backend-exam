import { UserEntity } from '../../../database/entities/user.entity';
import {
  PublicUserResponseDto,
  ShortUserResponseDto,
} from '../dto/res/public.user.response.dto';

export class UserMapper {
  public static toShortResponseDTO(user: UserEntity): ShortUserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || null,
      city: user.city || null,
    };
  }

  public static toPublicResponseDTO(user: UserEntity): PublicUserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age || null,
      avatar: user.avatar || null,
      city: user.city || null,
      bio: user.bio || null,
    };
  }
}
