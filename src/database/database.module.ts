import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
