import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db.config';
import { NftModule } from './nft/nft.module';
import { MintPriceModule } from './mint-price/mint-price.module';
import { ContractService } from './contract/contract.service';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    NftModule,
    MintPriceModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [ContractService],
})

export class AppModule {}
