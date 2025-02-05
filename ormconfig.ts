import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'node:path';
import * as process from 'node:process';

import configuration from './src/config/configuration';

dotenv.config();

const postgresConfig = configuration().database;

export default new DataSource({
  type: 'postgres',
  port: postgresConfig.port,
  host: postgresConfig.host,
  username: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.dbName,
  entities: [
    path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false,
});
