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
      throw new UnauthorizedException('Missing access token');
    }

    const payload: IJwtPayload = await this.tokenService.verifyToken(
      accessToken,
      TokenTypeEnum.ACCESS,
    );
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Token is not valid');
    }

    const tokenExists = await this.authCacheRedisService.isTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    if (!tokenExists) {
      throw new UnauthorizedException('Token is not valid');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return AuthMapper.toUserDataDTO(user, payload.deviceId);
  }
}
