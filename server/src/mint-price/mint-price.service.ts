import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MintPrice } from './entities/mint-price.entity';
import { CreateMintPriceDTO } from './dto/create-mint-price.dto';
import { UpdateMintPriceDTO } from './dto/update-mint-price-dto';

@Injectable()
export class MintPriceService {

  constructor(
    @InjectRepository(MintPrice)
    private readonly mintPriceRepository: Repository<MintPrice>,
  ) {}

  async checkPrice() {
    const id = 1;
    return this.mintPriceRepository.findOneBy({ id });
  }

  async create(createMintPriceDTO: CreateMintPriceDTO): Promise<MintPrice> {
    const newPrice = this.mintPriceRepository.create(createMintPriceDTO);
    return this.mintPriceRepository.save(newPrice);
  }

  async updatePrice(updateMintPriceDTO: UpdateMintPriceDTO): Promise<MintPrice> {
    const id = 1;
    await this.mintPriceRepository.update(id, updateMintPriceDTO);
    return this.mintPriceRepository.findOneBy({ id });
  }
}
