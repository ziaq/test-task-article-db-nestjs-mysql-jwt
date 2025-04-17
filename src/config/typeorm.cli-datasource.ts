import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [resolve('dist', 'modules', '**', '*.entity.js')],
  migrations: [resolve('dist', 'migrations', '*.js')],
});
