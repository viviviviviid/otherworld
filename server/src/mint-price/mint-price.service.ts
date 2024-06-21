import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MintPrice } from './entities/mint-price.entity';
import { CreateMintPriceDTO } from './dto/create-mint-price.dto';
import { UpdateMintPriceDTO } from './dto/update-mint-price-dto';
import { getPaymentPrice, updatePaymentPrice } from 'src/contract/interaction';

@Injectable()
export class MintPriceService {

  constructor(
    @InjectRepository(MintPrice)
    private readonly mintPriceRepository: Repository<MintPrice>,
  ) {}

  async checkPrice() {
    try{
      const id = 1;
      return this.mintPriceRepository.findOneBy({ id });
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async create(createMintPriceDTO: CreateMintPriceDTO): Promise<MintPrice> {
    try{
      const newPrice = this.mintPriceRepository.create(createMintPriceDTO);
      return this.mintPriceRepository.save(newPrice);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async updatePrice(): Promise<MintPrice> {
    try{
      const id = 1;
      await updatePaymentPrice(); // delegateCall (proxy to logic contract)
      const updatedMintPrice = await getPaymentPrice();
    
      var updateMintPriceDTO: UpdateMintPriceDTO = { mint_price: Number(updatedMintPrice) };
      
      await this.mintPriceRepository.update(id, updateMintPriceDTO);
      return this.mintPriceRepository.findOneBy({ id });
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }
}
