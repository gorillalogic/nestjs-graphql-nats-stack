import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UsersModule } from 'apps/nest-monorepo/src/users/users.module';
import { TasksModule } from './tasks.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TasksModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_TRANSPORT_PORT || 'nats://localhost:4222'],
        debug: true,
      },
    },
  );
  await app.listen();
}
bootstrap();
