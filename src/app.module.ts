import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    RepositoryModule,
    RedisModule,
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
