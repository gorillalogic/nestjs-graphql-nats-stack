import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GW_SERVICE',
        transport: Transport.NATS,
        options: {
          debug: true,
        },
      },
    ]),
  ],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
