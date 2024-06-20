import { Test, TestingModule } from '@nestjs/testing';
import { MintPriceController } from './mint-price.controller';
import { MintPriceService } from './mint-price.service';

describe('MintPriceController', () => {
  let controller: MintPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MintPriceController],
      providers: [MintPriceService],
    }).compile();

    controller = module.get<MintPriceController>(MintPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
