import { Injectable } from '@nestjs/common';
import { CreateNftDTO } from './dto/create-nft.dto';
import { UpdateNftDTO } from './dto/update-nft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NFT } from './entities/nft.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NftSrcService {

  constructor(
    @InjectRepository(NFT) 
    private readonly nftSrcRepository: Repository<NFT> 
  ) {}

  async create(createNftSrcDTO: CreateNftDTO): Promise<NFT> {
    const newSrc = this.nftSrcRepository.create(createNftSrcDTO);
    return this.nftSrcRepository.save(newSrc);
  }

  async findAll(address: string) {
    return this.nftSrcRepository.findBy({ address })
  }

  async findOne(token_id: number) {
    return this.nftSrcRepository.findOneBy({ token_id });
  }

  async update(token_id: number, updateNftSrcDTO: UpdateNftDTO) {
    await this.nftSrcRepository.update(token_id, updateNftSrcDTO);
    return this.nftSrcRepository.findOneBy({ token_id });
  }

  async remove(token_id: number) {
    await this.nftSrcRepository.delete( token_id );
  }

  async mint(token_id: number) {
    // ERC-20 approve
    // ERC-721 mint
    // 민트 완료 후, isMint를 true로 변경
    // 그 후, nft 테이블에 저장
  }
}
