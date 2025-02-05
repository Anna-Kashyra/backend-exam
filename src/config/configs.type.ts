export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type DatabaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  prefix: string;
};

export type JWTConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};
