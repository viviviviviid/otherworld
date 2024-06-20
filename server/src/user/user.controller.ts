import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(){
    return this.userService.findAll();
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.userService.findOne(address)
  }

  @Post('create')
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }


}
