import { Injectable } from '@nestjs/common';
import { CreateNftDTO } from './dto/create-nft.dto';
import { UpdateNftDTO } from './dto/update-nft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NFT } from './entities/nft.entity';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { approve, getPaymentPrice, mintNFT } from 'src/contract/interaction';

config();

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
    try{
      const currentMintPrice = await getPaymentPrice();

      // ERC-20 approve
      await approve(process.env.PROXY_CONTRACT_ADDRESS, currentMintPrice);
  
      // ERC-721 mint
      const nftSrc = await this.nftSrcRepository.findOneBy({ token_id });
      if (!nftSrc) {
        throw new Error(`NFT with token_id ${token_id} not found`);
      }
      await mintNFT(process.env.USER_ADDRESS, nftSrc.address);
  
      // 민트 완료 후, isMint를 true로 변경
      nftSrc.isMint = true;
      await this.nftSrcRepository.update(token_id, nftSrc);
      console.log('updated done')
    }catch(err){
      console.error("Error during mint process:", err);
      throw new Error(err);
    }
  }
}
