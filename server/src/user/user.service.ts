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
    try{
      const newUser = this.userRepository.create(createUserDTO);
      return this.userRepository.save(newUser);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async findAll() {
    try{
      return this.userRepository.find();
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async findOne(address: string) {
    try{
      return this.userRepository.findOneBy({ address });
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async remove(id: number) {
    try{
      return this.userRepository.delete(id);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

}
