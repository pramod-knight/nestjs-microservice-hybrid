import {
  Controller,
  UseFilters,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExceptionFilter } from 'src/exception.service';
import { ListUserDto } from './dto/user-list.dto';
import { FollowUserDto } from './dto/follower-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('createUser')
  create(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('findAllUser')
  findAll(@Payload() payload: ListUserDto) {
    return this.usersService.findAll(payload);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('validateUser')
  validateUser(@Payload() payload: {email: string, password: string}) {
    return this.usersService.validateEmailPassword(payload.email,payload.password);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('findUserBySlug')
  findUserDetails(@Payload() payload: {slug:string}) {
   return this.usersService.findOne(payload.slug);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('updateUser')
  updateUser(@Payload() payload: UpdateUserDto) {
    console.log(payload)
   return this.usersService.update(payload.slug ,payload,payload.updated_by);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('removeUser')
  removeUser(@Payload() payload: {slug:string}) {
   
    return this.usersService.remove(payload.slug);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('followUser')
  followUser(@Payload() payload: FollowUserDto) {
   
    return this.usersService.followUser(payload);
  }
  @UseFilters(new ExceptionFilter())
  @MessagePattern('unFollowUser')
  unFollowUser(@Payload() payload: FollowUserDto) {
   
    return this.usersService.unFollowUser(payload);
  }

}
