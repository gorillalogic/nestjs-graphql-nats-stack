import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.save(createTaskDto);
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  findOne(id: number): Promise<Task | null> {
    return this.tasksRepository.findOneBy({ id });
  }

  findOneBy(params: any): Promise<Task | null> {
    return this.tasksRepository.findOneBy(params);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const { id: _, ...props } = updateTaskDto;
    await this.tasksRepository.update(id, props);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean | null> {
    const record = await this.findOne(id);
    if (record === null) {
      return null;
    }
    const result = await this.tasksRepository.delete(record);
    return result.affected === 1;
  }
}
