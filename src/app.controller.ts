import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './users/dto/update-user.dto';

import { LoginAuthDto } from './auth/dto/login.dto';

import { CreatePostModuleDto } from './post-module/dto/create-post-module.dto';
import { CreateRoleDto } from './roles/dto/create-role.dto';
import { ListPostModuleDto } from './post-module/dto/list.module.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthenticationGuard } from './auth/authentication.guard';
import { Roles } from './auth/role.decorator';
import { ApiHeader } from '@nestjs/swagger';
import { ListUserDto } from './users/dto/user-list.dto';
import { FollowUserDto } from './users/dto/follower-user.dto';

@Controller()
export class AppController {
  
  constructor(
    private readonly appService: AppService,
    @Inject('USERS_SERVICE') private readonly userClient: ClientProxy,
    @Inject('ROLE_SERVICE') private readonly roleClient: ClientProxy,
    @Inject('Auth_SERVICE') private readonly authClient: ClientProxy,
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {}


  //////////////////  USER GATEWAY ////////////////////////////
  /** Create a new User */
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard,AuthenticationGuard)
  @Post('users/register')
  createNewUser(@Body() payload: CreateUserDto) {
    const pattern = 'createUser';
    return this.userClient.send(pattern, payload);
  }

  /**Get all List of users */
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard,AuthenticationGuard)
  @Post('users/list')
  findAllUsers(@Body() payload: ListUserDto) {
    const pattern = 'findAllUser';
    return this.userClient.send(pattern, payload);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard,AuthenticationGuard)
  @Get('users/get-details/:slug')
  findById(@Param() slug: string) {
    const pattern = 'findUserBySlug';
    return this.userClient.send(pattern, slug);
  }

  /** Update user */
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard,AuthenticationGuard)
  @Put('users/update/:slug')
  findByIdAndUpdate(@Param() slug: {slug:string}, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const pattern = 'updateUser';
    updateUserDto.slug = slug.slug;
    updateUserDto.updated_by = req.user.id;
    return this.userClient.send(pattern, updateUserDto);
  }

  /**Soft delete users */
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard,AuthenticationGuard)
  @Delete('users/remove/:slug')
  remove(@Param() slug: string) {
    const pattern = 'removeUser';
    return this.userClient.send(pattern, slug);
  }

   /**Follow user */
   @Roles(['admin','user'])
   @UseGuards(JwtAuthGuard,AuthenticationGuard)
   @Post('users/follow')
   followUser(@Body() payload: FollowUserDto) {
     const pattern = 'followUser';
     return this.userClient.send(pattern, payload);
   }
   @Roles(['admin','user'])
   @UseGuards(JwtAuthGuard,AuthenticationGuard)
   @Post('users/unfollow')
   unFollowUser(@Body() payload: FollowUserDto) {
     const pattern = 'unFollowUser';
     return this.userClient.send(pattern, payload);
   }
 

  /////////////////  ROLE GATEWAY  /////////////////////
  @ApiHeader({name:'authorization',description:"Access toke key required"})
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard,AuthenticationGuard)
  @Post('role/create')
  createNewRole(@Body() payload: CreateRoleDto) {
    const pattern = 'createRole';
    return this.roleClient.send(pattern, payload);
  }

  /////////////////  Auth GATEWAY  //////////////////////
  /** Login user */
  @Post('auth/login')
  login(@Body() payload: LoginAuthDto) {
    const pattern = 'login';
    return this.authClient.send(pattern, payload);
  }
  
}

