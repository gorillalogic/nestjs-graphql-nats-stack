import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  providers: [],
})
export class TasksModule {}
