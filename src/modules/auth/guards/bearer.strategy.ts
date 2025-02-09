import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

import { TokenService } from '../services/token.service';
import { AuthCacheRedisService } from '../services/auth.cache.redis.service';
import { TokenTypeEnum } from '../enums/token.type.enum';
import { IJwtPayload } from '../interfaces/jwt.payload.interface';
import { UserRepository } from '../../repository/services/user.repository';
import { AuthMapper } from '../services/auth.mapper';
import { IUserData } from '../interfaces/user.data.interface';
import { ERROR_MESSAGES } from '../../../common/exceptions/error.constants';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheRedisService: AuthCacheRedisService,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async validate(accessToken: string): Promise<IUserData> {
    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.MISSING_TOKEN);
    }

    const payload: IJwtPayload = await this.tokenService.verifyToken(
      accessToken,
      TokenTypeEnum.ACCESS,
    );
    if (!payload || !payload.userId) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const tokenExists = await this.authCacheRedisService.isTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    if (!tokenExists) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return AuthMapper.toUserDataDTO(user, payload.deviceId);
  }
}
