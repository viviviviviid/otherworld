import { Test, TestingModule } from '@nestjs/testing';
import { NftSrcController } from './nft.controller';
import { NftSrcService } from './nft.service';

describe('NftSrcController', () => {
  let controller: NftSrcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftSrcController],
      providers: [NftSrcService],
    }).compile();

    controller = module.get<NftSrcController>(NftSrcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
