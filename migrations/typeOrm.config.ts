import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { CreateTables1682025075452 } from './1682025075452-CreateTables';
import { CreateTasksTables1683344746633 } from './1683344746633-CreateTasksTables';

export const migrationsConfig: () => MysqlConnectionOptions = () => ({
  type: process.env.DATABASE_TYPE == 'mariadb' ? 'mariadb' : 'mysql',
  host: process.env.DATABASE_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_DATABASE ?? 'nestjs',
  username: process.env.DATABASE_USERNAME ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? 'secretpassword',
  migrations: [CreateTables1682025075452, CreateTasksTables1683344746633],
});

export default new DataSource(migrationsConfig());
