import { Global, Module } from '@nestjs/common';

import { UserRepository } from './services/user.repository';
import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refresh.token.repository';

const repositories = [PostRepository, UserRepository, RefreshTokenRepository];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
