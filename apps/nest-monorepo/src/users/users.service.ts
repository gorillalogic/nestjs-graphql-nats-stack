import { Injectable, Inject } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, map, timeout } from 'rxjs';
import { GraphQLError } from 'graphql';

const existsOrFail = (val: any) => {
  if (!val) {
    throw new GraphQLError('Not Found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }
  return val;
};

@Injectable()
export class UsersService {
  constructor(@Inject('GW_SERVICE') private client: ClientProxy) {}

  create(createUserInput: CreateUserInput): Promise<User | string> {
    const result = this.client
      .send<User>('createUser', createUserInput)
      .pipe(timeout(5000));
    return firstValueFrom(result);
  }

  findAll(): Promise<User[]> {
    const result = this.client.send<User[]>('findAllUsers', {}).pipe(
      timeout(5000),
      map((arr) => arr.map((row: User) => Object.assign(new User(), row))),
    );
    return firstValueFrom(result);
  }

  findOne(id: number): Promise<User> {
    const result = this.client
      .send<User>('findOneUser', id)
      .pipe(timeout(5000), map(existsOrFail));
    return firstValueFrom(result);
  }

  update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const result = this.client
      .send<User>('updateUser', updateUserInput)
      .pipe(timeout(5000), map(existsOrFail));
    return firstValueFrom(result);
  }

  remove(id: number): Promise<boolean> {
    const result = this.client
      .send<boolean>('removeUser', id)
      .pipe(timeout(5000), map(existsOrFail));
    return firstValueFrom(result);
  }
}
