import { Injectable, Inject } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
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
export class TasksService {
  constructor(@Inject('GW_SERVICE') private client: ClientProxy) {}

  create(createTaskInput: CreateTaskInput): Promise<Task | string> {
    const result = this.client
      .send<Task>('createTask', createTaskInput)
      .pipe(timeout(5000));
    return firstValueFrom(result);
  }

  findAll(): Promise<Task[]> {
    const result = this.client.send<Task[]>('findAllTasks', {}).pipe(
      timeout(5000),
      map((arr) => arr.map((row: Task) => Object.assign(new Task(), row))),
    );
    return firstValueFrom(result);
  }

  findOne(id: number): Promise<Task> {
    const result = this.client
      .send<Task>('findOneTask', id)
      .pipe(timeout(5000), map(existsOrFail));
    return firstValueFrom(result);
  }

  update(id: number, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const result = this.client
      .send<Task>('updateTask', updateTaskInput)
      .pipe(timeout(5000), map(existsOrFail));
    return firstValueFrom(result);
  }

  remove(id: number): Promise<boolean> {
    const result = this.client
      .send<boolean>('removeTask', id)
      .pipe(timeout(5000), map(existsOrFail));
    return firstValueFrom(result);
  }
}
