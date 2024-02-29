import { Test, TestingModule } from '@nestjs/testing';
import { PostModuleController } from './post-module.controller';
import { PostModuleService } from './post-module.service';

describe('PostModuleController', () => {
  let controller: PostModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostModuleController],
      providers: [PostModuleService],
    }).compile();

    controller = module.get<PostModuleController>(PostModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
