import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '@config';
import { DataSource } from 'typeorm';

export const DBDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  username: DB_USER,
  password: DB_PASSWORD,
  synchronize: false,
  logging: false,
  charset: 'utf8',
  entities: [],
});
