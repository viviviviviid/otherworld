import { Test, TestingModule } from '@nestjs/testing';
import { MintPriceService } from './mint-price.service';

describe('MintPriceService', () => {
  let service: MintPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MintPriceService],
    }).compile();

    service = module.get<MintPriceService>(MintPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
