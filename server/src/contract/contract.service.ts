import { Injectable } from '@nestjs/common';
import { ethers, JsonRpcProvider } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContractService {
  private provider: JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    const providerUrl = 'http://localhost:8545'; 
    this.provider = new JsonRpcProvider(providerUrl);

    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // 실제 개인 키로 대체
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // 실제 컨트랙트 주소로 대체
    const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname, 'YourContract.abi.json'), 'utf8'));

    this.contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);
  }

  async interactWithContract(methodName: string, ...args: any[]) {
    const tx = await this.contract[methodName](...args);
    return tx.wait();
  }

  async callContractMethod(methodName: string, ...args: any[]) {
    return this.contract[methodName](...args);
  }




}
