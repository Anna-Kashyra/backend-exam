import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JWTConfig } from '../../../config/configs.type';
import { IJwtPayload } from '../interfaces/jwt.payload.interface';
import { ITokenPair } from '../interfaces/token.pair.interface';
import { TokenTypeEnum } from '../enums/token.type.enum';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JWTConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JWTConfig>('jwt');
  }

  public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  public verifyToken(token: string, type: TokenTypeEnum): Promise<IJwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.getSecret(type),
    });
  }

  private getSecret(type: TokenTypeEnum): string {
    let secret: string;
    switch (type) {
      case TokenTypeEnum.ACCESS:
        secret = this.jwtConfig.accessSecret;
        break;
      case TokenTypeEnum.REFRESH:
        secret = this.jwtConfig.refreshSecret;
        break;
      default:
        throw new Error('Unknown token type');
    }
    return secret;
  }
}
