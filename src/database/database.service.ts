import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'node:path';

import { Config, DatabaseConfig } from '../config/configs.type';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<Config>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const postgresConfig = this.configService.get<DatabaseConfig>('database');
    return {
      type: 'postgres',
      port: postgresConfig.port,
      host: postgresConfig.host,
      username: postgresConfig.user,
      password: postgresConfig.password,
      database: postgresConfig.dbName,
      // entities: [
      //   path.join(process.cwd(), 'dist', 'database', 'entities', '*.entity.js'),
      // ],
      // migrations: [
      //   path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
      // ],

      entities: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'entities',
          '*.entity.js',
        ),
      ],
      migrations: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'migrations',
          '*.js',
        ),
      ],
      synchronize: false,
      migrationsRun: true,
    };
  }
}
