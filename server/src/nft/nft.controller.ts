import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NftSrcService } from './nft.service';
import { CreateNftDTO } from './dto/create-nft.dto';
import { UpdateNftDTO } from './dto/update-nft.dto';

@Controller('nft-src')
export class NftSrcController {
  constructor(private readonly nftSrcService: NftSrcService) {}

  @Get('/address/:address')
  findAll(@Param('address') address: string) {
    return this.nftSrcService.findAll(address);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.nftSrcService.findOne(id);
  }

  @Post("create")
  create(@Body() createNftSrcDTO: CreateNftDTO) {
    return this.nftSrcService.create(createNftSrcDTO);
  }

  // @Post("mint/:id")
  // mint(@Body() ) {
  
  // }

  @Patch(':id')
  update(@Param('id') id: number, @Body() UpdateNftSrcDTO: UpdateNftDTO) {
    return this.nftSrcService.update(id, UpdateNftSrcDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.nftSrcService.remove(id);
  }
}
