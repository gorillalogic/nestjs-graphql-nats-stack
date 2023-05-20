import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UseFilters } from '@nestjs/common';
import { ExceptionFilter } from '../exception.filter';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RequestUser, User } from '../auth/user.decorator';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  @UseFilters(ExceptionFilter)
  @Roles(Role.User)
  createTask(
    @User() user: RequestUser,
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ) {
    return this.tasksService.create(createTaskInput, user.id);
  }

  @Query(() => [Task], { name: 'tasks' })
  @UseFilters(ExceptionFilter)
  findAll(@User() user: RequestUser) {
    return this.tasksService.findAll(user.id);
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
