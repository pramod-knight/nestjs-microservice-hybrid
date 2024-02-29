import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}

  // Create new role function
  async create(createRoleDto: CreateRoleDto) {
    let CreatedNewRole = await this.RoleModel.create(createRoleDto);

    return {
      statusCode: HttpStatus.OK,
      error: {},
      data: CreatedNewRole,
      message: 'New Role Created.',
    };
  }

  //Fetch role information by ID
  async findOne(id: string) {
    let data = await this.RoleModel.findOne({ _id: id });
    return data
  }
}
