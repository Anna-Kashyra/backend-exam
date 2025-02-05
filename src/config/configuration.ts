import * as process from 'process';
import { Config } from './configs.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
  },
  database: {
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST,
    prefix: process.env.REDIS_ACCESS_TOKEN_PREFIX || 'ACCESS_TOKEN',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN),
  },
});
