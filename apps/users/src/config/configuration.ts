import { User } from '../users/entities/user.entity';

export default () => ({
  port: process.env.PORT,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_DATABASE,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [User],
    syncronize: true,
    logging: true,
  },
});
