import { UserEntity } from '../../../database/entities/user.entity';
import { ITokenPair } from '../interfaces/token.pair.interface';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { IUserData } from '../interfaces/user.data.interface';
import { TokenPairResponseDto } from '../dto/token.pair.response.dto';

export class AuthMapper {
  public static toResponseDTO(
    user: UserEntity,
    tokenPair: ITokenPair,
  ): AuthResponseDto {
    return {
      tokens: this.toResponseTokensDTO(tokenPair),
      user: UserMapper.toShortResponseDTO(user),
    };
  }

  public static toResponseTokensDTO(
    tokenPair: ITokenPair,
  ): TokenPairResponseDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  public static toUserDataDTO(user: UserEntity, deviceId: string): IUserData {
    return {
      userId: user.id,
      email: user.email,
      deviceId,
    };
  }
}
