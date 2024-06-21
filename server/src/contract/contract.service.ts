import { Injectable } from '@nestjs/common';
import { mintNFT, approve, getLastNFTInfo, getNFTInfo, getNextTokenID, updatePaymentPrice, getPaymentPrice, upgradeLogicContract } from './interaction'

@Injectable()
export class ContractService {

  async approve(spender: string, amount: number) {
    try{
      await approve(spender, amount);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async mintNFT(to: string, tokenURI: string) {
    try{
      await mintNFT(to, tokenURI);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async getLastNFTInfo() {
    try{
      await getLastNFTInfo();
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async getNFTInfo(tokenId: number) {
    try{
      await getNFTInfo(tokenId);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async getNextTokenID() {
    try{
      await getNextTokenID();
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async updatePaymentPrice() {
    try{
      await updatePaymentPrice();
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async getPaymentPrice() {
    try{
      const mintPrice = await getPaymentPrice();
      return mintPrice;
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }

  async upgradeLogicContract(logicContract: string) {
    try{
      await upgradeLogicContract(logicContract);
    }catch(err){
      console.error("Error:", err);
      throw new Error(err);
    }
  }
}
