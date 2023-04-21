export default () => ({
  port: process.env.PORT,
  database: {
    type: process.env.DATABASE_TYPE ?? 'mysql',
    host: process.env.DATABASE_HOST ?? '127.0.0.1',
    port: process.env.DATABASE_PORT ?? 3306,
    database: process.env.DATABASE_DATABASE ?? 'nestjs',
    username: process.env.DATABASE_USERNAME ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'secretpassword',
    autoLoadEntities: true,
    syncronize: false,
    logging: true,
  },
});
