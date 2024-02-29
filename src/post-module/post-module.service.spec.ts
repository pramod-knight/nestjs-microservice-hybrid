import { Test, TestingModule } from '@nestjs/testing';
import { PostModuleService } from './post-module.service';

describe('PostModuleService', () => {
  let service: PostModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostModuleService],
    }).compile();

    service = module.get<PostModuleService>(PostModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
