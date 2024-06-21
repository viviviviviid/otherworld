import { config } from 'dotenv';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

config();

const providerUrl = process.env.PROVIDER_URL || 'http://127.0.0.1:8545';
const provider = new ethers.JsonRpcProvider(providerUrl);

const privateKey = process.env.USER_PRIVATE_KEY!;
console.log(privateKey);
const wallet = new ethers.Wallet(privateKey, provider);

const loadContract = (contractName: string, fileName: string, addressEnvVar: string) => {
  const address = process.env[addressEnvVar];
  if (!address) {
    throw new Error(`Environment variable ${addressEnvVar} is not set.`);
  }
  
  const abiPath = path.join(__dirname, `../../../contract/artifacts/contracts/${contractName}.sol/${fileName}.json`);
  const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const contractAbi = contractJson.abi;

  return new ethers.Contract(address, contractAbi, wallet);
}

const proxyContract = loadContract('Proxy', 'Proxy', 'PROXY_CONTRACT_ADDRESS');
const logicContract = loadContract('Logic', 'PaymentLogic', 'LOGIC_CONTRACT_ADDRESS');
const tokenContract = loadContract('ERC20', 'PaymentToken', 'TOKEN_CONTRACT_ADDRESS');

const approve = async (spender: string, amount: number) => {
  try {
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
    console.log('nonce: ', nonce);
    const tx = await tokenContract.approve(spender, amount, { nonce });
    await tx.wait();
    console.log('Approved done');
  } catch (err) {
    console.log(err);
  }
}

const mintNFT = async (to: string, tokenURI: string) => {
  try {
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
    console.log('nonce: ', nonce);
    const tx = await proxyContract.mintNFT(to, tokenURI, { nonce });
    await tx.wait();
    console.log('Minted NFT done');
  } catch (err) {
    console.log(err);
  }
}

const getLastNFTInfo = async () => {
  try {
    const tokenId = await proxyContract.getNextTokenID();
    console.log(`Next token ID: ${tokenId}`);
    const tokenURI = await proxyContract.getTokenURI(Number(tokenId) - 1);
    console.log(`Last NFT's URI: ${tokenURI}`);
  } catch (err) {
    console.log(err);
  }
}

const getNFTInfo = async (tokenId: number) => {
  try {
    const tokenURI = await proxyContract.getTokenURI(tokenId);
    console.log(`Last NFT's URI: ${tokenURI}`);
  } catch (err) {
    console.log(err);
  }
}

const getNextTokenID = async () => {
  try {
    const tokenId = await proxyContract.getNextTokenID();
    console.log(`Next token ID: ${tokenId}`);
  } catch (err) {
    console.log(err);
  }
}

const updatePaymentPrice = async () => {
  try {
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
    console.log('nonce: ', nonce);
    const tx = await proxyContract.updatePaymentPrice({ nonce });
    await tx.wait();
    console.log('updated payment price: ', await proxyContract.getPaymentPrice());
  } catch (err) {
    console.log(err);
  }
}

const getPaymentPrice = async () => {
  try {
    const mintPrice = await proxyContract.getPaymentPrice();
    return mintPrice;
  } catch (err) {
    console.error("Error fetching payment price:", err);
  }
}

const upgradeLogicContract = async (logicContract: string) => {
  try {
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
    console.log('nonce: ', nonce);
    const tx = await proxyContract.updateLogicContract(logicContract, { nonce });
    await tx.wait();
    console.log('Current logic contract: ', await proxyContract.getLogicContract());
    console.log('Testing updatePaymentPrice function by delegateCall of new logic contract');
    await updatePaymentPrice();
    await getPaymentPrice();
  } catch (err) {
    console.log(err);
  }
}

export {
  mintNFT,
  approve,
  getLastNFTInfo,
  getNFTInfo,
  getNextTokenID,
  updatePaymentPrice,
  getPaymentPrice,
  upgradeLogicContract
};
