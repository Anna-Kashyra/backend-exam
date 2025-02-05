import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
