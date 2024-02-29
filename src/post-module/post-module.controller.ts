import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostModuleService } from './post-module.service';
import { CreatePostModuleDto } from './dto/create-post-module.dto';
import { UpdatePostModuleDto } from './dto/update-post-module.dto';
import { ExceptionFilter } from 'src/exception.service';
import { ListPostModuleDto } from './dto/list.module.dto';
@Controller()
export class PostModuleController {
  constructor(private readonly postModuleService: PostModuleService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('createPostModule')
  create(@Payload() createPostModuleDto: CreatePostModuleDto) {
    return this.postModuleService.create(createPostModuleDto);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('findAllPostModule')
  findAll(@Payload() payload: ListPostModuleDto) {
    return this.postModuleService.findAll(payload);
  }

 
  @UseFilters(new ExceptionFilter())
  @MessagePattern('findPostByUserId')
  findOne(@Payload() Payload: any) {
    let { slug } = Payload;
    return this.postModuleService.findOne(slug);
  }

}
