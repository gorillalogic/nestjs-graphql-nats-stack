import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  GqlExecutionContext,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import {
  createParamDecorator,
  ExecutionContext,
  UseFilters,
} from '@nestjs/common';
import { ExceptionFilter } from '../exception.filter';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request['user_id'];
  },
);

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  @UseFilters(ExceptionFilter)
  createTask(
    @UserId() userId: string,
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ) {
    return this.tasksService.create(createTaskInput, userId);
  }

  @Query(() => [Task], { name: 'tasks' })
  @UseFilters(ExceptionFilter)
  findAll(@UserId() userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Query(() => Task, { name: 'task' })
  @UseFilters(ExceptionFilter)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => Task)
  @UseFilters(ExceptionFilter)
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.remove(id);
  }
}
