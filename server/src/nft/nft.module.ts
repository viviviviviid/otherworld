import { Module } from '@nestjs/common';
import { NftSrcService } from './nft.service';
import { NftSrcController } from './nft.controller';
import { NFT } from './entities/nft.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NFT])],
  controllers: [NftSrcController],
  providers: [NftSrcService],
})
export class NftModule {}
