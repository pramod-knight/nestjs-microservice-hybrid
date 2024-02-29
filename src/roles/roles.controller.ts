import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ExceptionFilter } from 'src/exception.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('createRole')
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
}
