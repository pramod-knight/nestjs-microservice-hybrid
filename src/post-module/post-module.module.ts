import { Module } from '@nestjs/common';
import { PostModuleService } from './post-module.service';
import { PostModuleController } from './post-module.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post-module.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostModuleController],
  providers: [PostModuleService]
})
export class PostModuleModule {}
