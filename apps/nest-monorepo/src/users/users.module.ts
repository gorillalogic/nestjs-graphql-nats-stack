import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
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
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
