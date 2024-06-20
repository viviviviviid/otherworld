import { Test, TestingModule } from '@nestjs/testing';
import { NftSrcService } from './nft.service';

describe('NftSrcService', () => {
  let service: NftSrcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftSrcService],
    }).compile();

    service = module.get<NftSrcService>(NftSrcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
