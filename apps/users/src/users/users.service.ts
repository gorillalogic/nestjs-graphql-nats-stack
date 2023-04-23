import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneBy(params: any): Promise<User | null> {
    return this.usersRepository.findOneBy(params);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const { id: _, ...props } = updateUserDto;
    await this.usersRepository.update(id, props);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean | null> {
    const record = await this.findOne(id);
    if (record === null) {
      return null;
    }
    const result = await this.usersRepository.delete(record);
    return result.affected === 1;
  }
}
