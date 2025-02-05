import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../../redis/redis.module';
import { TokenService } from './services/token.service';
import { AuthCacheRedisService } from './services/auth.cache.redis.service';
import { BearerStrategy } from './guards/bearer.strategy';
import { ConfigService } from '@nestjs/config';
import { RefreshGuard } from './guards/refresh.guard';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'bearer',
      session: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthCacheRedisService,
    BearerStrategy,
    RefreshGuard,
    // {
    //   provide: APP_GUARD,
    //   useClass: BearerStrategy,
    // },
  ],
  exports: [],
})
export class AuthModule {}
