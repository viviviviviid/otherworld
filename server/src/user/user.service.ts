import { CreateUserDTO } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  
  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = this.userRepository.create(createUserDTO);
    return this.userRepository.save(newUser);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(address: string) {
    return this.userRepository.findOneBy({ address });
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

}
