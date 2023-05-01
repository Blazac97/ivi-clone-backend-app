import { Test, TestingModule } from '@nestjs/testing';
import { FactsService } from './facts.service';

describe('FactsService', () => {
  let service: FactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactsService],
    }).compile();

    service = module.get<FactsService>(FactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
