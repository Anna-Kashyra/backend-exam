import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignInRequestDto, SignUpRequestDto } from '../dto/auth.request.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserRepository } from '../../repository/services/user.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh.token.repository';
import { TokenService } from './token.service';
import { AuthCacheRedisService } from './auth.cache.redis.service';
import { AuthMapper } from './auth.mapper';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { UserService } from '../../user/services/user.service';
import { IUserData } from '../interfaces/user.data.interface';
import { TokenPairResponseDto } from '../dto/token.pair.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly authCacheRedisService: AuthCacheRedisService,
  ) {}

  public async signUp(dto: SignUpRequestDto): Promise<AuthResponseDto> {
    await this.userService.isEmailUnique(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const userData: Partial<UserEntity> = { ...dto, password };
    const user: UserEntity = await this.userRepository.save(
      this.userRepository.create(userData),
    );

    const tokenPair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          userId: user.id,
          refreshToken: tokenPair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheRedisService.saveToken(
        tokenPair.accessToken,
        user.id,
        dto.deviceId,
      ),
    ]);
    return AuthMapper.toResponseDTO(user, tokenPair);
  }

  public async signIn(dto: SignInRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        userId: user.id,
      }),
      this.authCacheRedisService.deleteToken(user.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          userId: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheRedisService.saveToken(
        pair.accessToken,
        user.id,
        dto.deviceId,
      ),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, pair);
  }

  public async refresh(userData: IUserData): Promise<TokenPairResponseDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        userId: userData.userId,
      }),
      this.authCacheRedisService.deleteToken(
        userData.userId,
        userData.deviceId,
      ),
    ]);
    const tokenPair = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          userId: userData.userId,
          refreshToken: tokenPair.refreshToken,
          deviceId: userData.deviceId,
        }),
      ),
      this.authCacheRedisService.saveToken(
        tokenPair.accessToken,
        userData.userId,
        userData.deviceId,
      ),
    ]);
    return AuthMapper.toResponseTokensDTO(tokenPair);
  }

  public async logout(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        userId: userData.userId,
      }),
      this.authCacheRedisService.deleteToken(
        userData.userId,
        userData.deviceId,
      ),
    ]);
  }
}
