import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '../../repository/services/user.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh.token.repository';
import { AuthMapper } from '../services/auth.mapper';
import { TokenService } from '../services/token.service';
import { TokenTypeEnum } from '../enums/token.type.enum';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isExist =
      await this.refreshTokenRepository.isTokenExist(refreshToken);
    if (!isExist) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = AuthMapper.toUserDataDTO(user, payload.deviceId);
    return true;
  }
}
