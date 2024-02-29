import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { ListUserDto } from './dto/user-list.dto';
import { FollowUserDto } from './dto/follower-user.dto';
import { UserFollower } from './entities/follower.entity';

@Injectable()
export class UsersService {
  createUserDto: any;
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(UserFollower.name) private usersFollowerModel: Model<UserFollower>,
    
  ) {}

  //create new user
  async create(createUserDto: CreateUserDto) {
    try {
      // const saltOrRounds = process.env.SALT_ROUND || 10;
      const saltOrRounds = 10;

      const password = createUserDto.password;
      /**generate hash of password */
      const hash = await bcrypt.hash(password, saltOrRounds);
      createUserDto.password = hash;
      
      let newUser = await this.usersModel.create(createUserDto);
      const userJson = newUser.toJSON();
      [
        'is_deleted',
        'status',
        'is_Edit',
        '__v',
        'createdAt',
        'updatedAt',
        'password',
      ].forEach((key) => delete userJson[key]);
      return {
        statusCode: HttpStatus.OK,
        error: {},
        data: userJson,
        message: 'New User Created.',
      };
    } catch (err) {
      const errorMsg = err.errors ? err.errors[0].message : err.message;
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        status: 'error',
        msg: errorMsg,
      };
    }
  }

  //Listing of users
  async findAll(payload: ListUserDto) {
    let pageSize = payload.itemsPerPage ? payload.itemsPerPage : 10;
    let skip =
      payload.pageNumber <= 0 || payload.pageNumber == 1
        ? 0
        : (payload.pageNumber - 1)*pageSize;
        console.log(skip)
    let newUser = await this.usersModel
      .aggregate([
        { $addFields: { role_id: { $toObjectId: '$role' } } },
        { $match: { is_deleted: 0 } },
        {
          $lookup: {
            from: 'roles',
            foreignField: '_id',
            localField: 'role_id',
            as: 'role_details',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {$project:{
          username:1,
          role_details:1,
          email:1,
          profile_photo:1,
          followers:1,
          bio:1,
          slug:1,
          _id:0
        }},
        {$sort:{createdAt:-1}},
        { $skip: skip },
        { $limit: pageSize },
      ])
    let count = await this.usersModel.count({ status: 1, is_deleted: 0 });
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: `List of Users.`,
      data: newUser,
      total_count: count,
    };
  }

  //Detail of users by slug
  async findOne(slug: string) {
    let dataFind = await this.usersModel
      .aggregate([
        { $addFields: { role_id: { $toObjectId: '$role' } } },
        { $match: { slug: slug, is_deleted:0 } },
        {
          $lookup: {
            from: 'roles',
            foreignField: '_id',
            localField: 'role_id',
            as: 'role_details',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },

        {
          $unwind: '$role_details',
        },
        {$project:{
          username:1,
          role_details:1,
          email:1,
          profile_photo:1,
          followers:1,
          bio:1,
          slug:1,
          created_by:1,
          updated_by:1
        }},
      ])
      .then((items) => items[0]);

    return {
      statusCode: HttpStatus.OK,
      error: {},

      data: dataFind,
      message: 'User details.',
    };
  }

  // Update user
  async update(slug: string, updateUserDto: UpdateUserDto,updatedBy:string) {
    let updateddata = await this.usersModel.findOneAndUpdate(
      { slug: slug },
      {
        $set:{
          username: updateUserDto.username,
          bio: updateUserDto.bio,
          profile_photo: updateUserDto.profile_photo,
          updated_by:updatedBy
        }
      },
      {
        upsert: false,
        new: true,
      },
    );
    return {
      statusCode: HttpStatus.OK,
      error: {},
      data: updateddata,
      message: 'User updated.',
    };
  }

  //Delete user
  async remove(slug: string) {
    let data = await this.usersModel.updateOne(
      {
        slug: slug,
      },
      { is_deleted: 1 },
    );
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'User deleted.',
      data: {},
    };
  }


  async findOneByEmail(email: string) {
    let datafind = await this.usersModel.findOne({ email: email });
    return datafind;
  }

  async validateEmailPassword(email: string, password: string) {
    let dataFind = await this.usersModel.findOne({ email: email,status:1,is_deleted:0 });
    if(!dataFind){
      return null
    }
    let comparePass = await bcrypt.compare(password, dataFind.password);

    if(!comparePass){
      return null
    };
    delete dataFind.password
    return dataFind;
    
  }

  async followUser(payload:FollowUserDto){
    /** check if already followed */
    let count = await this.usersFollowerModel.count(payload);
    if(count){
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: {},
        message: 'User already followed.',
      };
    }
    let createdData = await this.usersFollowerModel.create(payload);
    return {
      statusCode: HttpStatus.CREATED,
      error: {},
      message: 'User followed successfully.',
    };
  }
  async unFollowUser(payload:FollowUserDto){
    let unFollowData = await this.usersFollowerModel.deleteOne({followed_by: payload.followed_by,follower_id:payload.follower_id});
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'User unFollowed successfully.',
    };
  }
}
