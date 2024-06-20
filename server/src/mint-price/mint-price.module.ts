import { Module } from '@nestjs/common';
import { MintPriceService } from './mint-price.service';
import { MintPriceController } from './mint-price.controller';
import { MintPrice } from './entities/mint-price.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MintPrice])],
  controllers: [MintPriceController],
  providers: [MintPriceService],
})
export class MintPriceModule {}
