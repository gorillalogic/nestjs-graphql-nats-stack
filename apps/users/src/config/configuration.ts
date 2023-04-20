import { User } from '../users/entities/user.entity';
import { CreateTables1682025075452 } from '../migrations/1682025075452-CreateTables';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default () => ({
  port: process.env.PORT,
  database: {
    type: process.env.DATABASE_TYPE ?? 'mysql',
    host: process.env.DATABASE_HOST ?? '127.0.0.1',
    port: process.env.DATABASE_PORT ?? 3306,
    database: process.env.DATABASE_DATABASE ?? 'nestjs',
    username: process.env.DATABASE_USERNAME ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'secretpassword',
    entities: [User],
    syncronize: false,
    logging: true,
  },
});

export const migrationsConfig : (() => MysqlConnectionOptions) = () => ({
  type: process.env.DATABASE_TYPE == 'mariadb' ? 'mariadb' : 'mysql',
  host: process.env.DATABASE_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_DATABASE ?? 'nestjs',
  username: process.env.DATABASE_USERNAME ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? 'secretpassword',
  migrations: [CreateTables1682025075452],
});