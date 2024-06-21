import { Injectable } from '@nestjs/common';
import { mintNFT, approve, getLastNFTInfo, getNFTInfo, getNextTokenID, updatePaymentPrice, getPaymentPrice, upgradeLogicContract } from './interaction'

@Injectable()
export class ContractService {

  async approve(spender: string, amount: number) {
    await approve(spender, amount);
  }

  async mintNFT(to: string, tokenURI: string) {
    await mintNFT(to, tokenURI);
  }

  async getLastNFTInfo() {
    await getLastNFTInfo();
  }

  async getNFTInfo(tokenId: number) {
    await getNFTInfo(tokenId);
  }

  async getNextTokenID() {
    await getNextTokenID();
  }

  async updatePaymentPrice() {
    await updatePaymentPrice();
  }

  async getPaymentPrice() {
    const mintPrice = await getPaymentPrice();
    return mintPrice;
  }

  async upgradeLogicContract(logicContract: string) {
    await upgradeLogicContract(logicContract);
  }

}
