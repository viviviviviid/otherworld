import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MintPriceService } from './mint-price.service';
import { CreateMintPriceDTO } from './dto/create-mint-price.dto';
import { UpdateMintPriceDTO } from './dto/update-mint-price-dto';

@Controller('mint-price')
export class MintPriceController {
  constructor(private readonly mintPriceService: MintPriceService) {}

  @Get()
  async getCurrentPrice() {
    return this.mintPriceService.checkPrice();
  }

  @Post()
  async create(@Body() createMintPriceDTO: CreateMintPriceDTO) {
    return this.mintPriceService.create(createMintPriceDTO);
  }

  @Patch()
  async updatePrice() {
    return await this.mintPriceService.updatePrice() ;
  }
  
}
