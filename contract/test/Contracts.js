const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const mockingURI = "https://fuchsia-comprehensive-earwig-142.mypinata.cloud/ipfs/QmVhTz6GjrEQKMt32qRi8j7N18F932VJTGPGrMs8SBVkWF";
const mockingNum = 34985238;
const mockingAddr = "0xAAC129A3e6e9f44147951dDD5655d66c312A4713";

const deployTokenFixture = async () => {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const tokenContract = await ethers.deployContract("PaymentToken");
  await tokenContract.waitForDeployment();
  return { tokenContract, owner, addr1, addr2 };
}

const deployLogicFixture = async () => {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const logicContract = await ethers.deployContract("PaymentLogic");
  await logicContract.waitForDeployment();
  return { logicContract, owner, addr1, addr2 };
}

const deployProxyFixture = async () => {
  const [owner] = await ethers.getSigners();
  const {tokenContract, logicContract} = await deploySubContracts();
  const proxyContract = await ethers.deployContract("Proxy");
  await proxyContract.waitForDeployment();

  await proxyContract.initialize(tokenContract.target, mockingNum, logicContract.target)
  await proxyContract.updatePaymentPrice();

  return { proxyContract, tokenContract, logicContract, owner, "initTokenPrice":mockingNum};
}

const deploySubContracts = async () => {
  const tokenContract = await ethers.deployContract("PaymentToken");
  await tokenContract.waitForDeployment();
  const logicContract = await ethers.deployContract("PaymentLogic");
  await logicContract.waitForDeployment();

  return {tokenContract, logicContract};
}

describe("Token contract", () => {
  it("배포자에게 토큰의 초기 공급량을 할당해야 합니다.", async () => {
    const { tokenContract, owner } = await loadFixture(deployTokenFixture);
    const ownerBalance = await tokenContract.balanceOf(owner.address);
    expect(await tokenContract.totalSupply()).to.equal(ownerBalance);
  });

  it("계정간에 토큰을 전송할 수 있어야 합니다.", async () => {
    const { tokenContract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );
    
    await expect(
      tokenContract.transfer(addr1.address, 50)
    ).to.changeTokenBalances(tokenContract, [owner, addr1], [-50, 50]);

    await expect(
      tokenContract.connect(addr1).transfer(addr2.address, 50)
    ).to.changeTokenBalances(tokenContract, [addr1, addr2], [-50, 50]);
  });
});

describe("Logic contract", () => {
  it("시드를 기반으로 선형 합동 생성기 공식을 사용하여 0부터 99까지의 난수를 생성하고, 매번 값이 달라져야 합니다.", async () => {
    const { logicContract, owner } = await loadFixture(deployLogicFixture);
    let values = [];
    
    for (let i = 0; i < 10; i++) {
      await logicContract.calculatePrice();
      let temp = await logicContract.getPaymentPrice();
      values.push(temp); 
    }

    const allSame = values.every((val, _, arr) => val === arr[0]);
    expect(allSame).to.be.false;
  });
});

describe("Proxy Contract", () =>  {

  describe("Contract Initialize", () => {
    it("초기화 후 파라미터로 사용된 토큰 컨트랙트 주소값이 정상적으로 확인되어야 합니다.", async () => {
      const { proxyContract, tokenContract } = await loadFixture(deployProxyFixture);
      expect(await proxyContract.getTokenContract()).to.equal(tokenContract.target);
      
    });

    it("초기화 후 파라미터로 사용된 로직 컨트랙트 주소값이 정상적으로 확인되어야 합니다.", async () => {
      const { proxyContract, logicContract } = await loadFixture(deployProxyFixture);
      expect(await proxyContract.getLogicContract()).to.equal(logicContract.target);
    });
  });

  describe("Excute DelegateCall", () => {
    it("DelegatCall이 정상적으로 수행되어야 합니다.", async () => {
      const { proxyContract, mockingNum} = await loadFixture(deployProxyFixture);
      const initPrice = await proxyContract.getPaymentPrice();
      await proxyContract.updatePaymentPrice();
      expect(await proxyContract.getPaymentPrice()).to.not.equal(initPrice);
    });

    it("일반적인 Call과는 반대로, DelegateCall로 인한 state 변화는 Logic 쪽에선 일어나지 않아야 합니다.", async () => {
      const { proxyContract, logicContract} = await loadFixture(deployProxyFixture);
      const beforeValueOfLogic = await logicContract.getPaymentPrice();
      await proxyContract.updatePaymentPrice();
      expect(await logicContract.getPaymentPrice()).to.equal(beforeValueOfLogic);  
    });
  });

  describe("Upgrade Logic Contract", () => {
    it("로직 컨트랙트를 정상적으로 업그레이드 할 수 있어야합니다.", async () => {
      const {tokenContract, logicContract} = await deploySubContracts();
      const proxyContract = await ethers.deployContract("Proxy");
      await proxyContract.waitForDeployment();
      await proxyContract.initialize(tokenContract.target, mockingNum, mockingAddr);
      const initPrice = await proxyContract.getPaymentPrice();
      await proxyContract.updateLogicContract(logicContract);
      await proxyContract.updatePaymentPrice();
      expect(await proxyContract.getPaymentPrice()).to.not.equal(initPrice);
    });
  });

  describe("Mint NFT", () => {
    it("NFT 발행 후 지갑 잔고가 올바르게 업데이트되어야 합니다.", async () => {
      const { proxyContract, tokenContract , owner } = await loadFixture(deployProxyFixture);
      const initialBalance = await tokenContract.balanceOf(owner.address);
      await approveAndMint(proxyContract, tokenContract, owner);
      const currentPaymentPrice = await proxyContract.getPaymentPrice();
      expect(await tokenContract.balanceOf(owner.address)).to.equal(initialBalance-currentPaymentPrice);
    });

    it("토큰 메타데이터에 정확한 URI가 포함되어야 합니다.", async () => {
      const { proxyContract, tokenContract, owner } = await loadFixture(deployProxyFixture);
      const tokenID = await approveAndMint(proxyContract, tokenContract, owner);
      expect(await proxyContract.getTokenURI(tokenID)).to.equal(mockingURI);
    });

    it("NFT 발행 후 다음 토큰 ID가 1 증가해야 합니다.", async () => {
      const { proxyContract, tokenContract, owner } = await loadFixture(deployProxyFixture);
      const tokenID = await approveAndMint(proxyContract, tokenContract, owner);
      expect(await proxyContract.getNextTokenID() - tokenID).to.equal(1);
    });

    it("msg.sender와 토큰 소유자가 일치해야 합니다.", async () => {
      const { proxyContract, tokenContract, owner } = await loadFixture(deployProxyFixture);
      const tokenID = await approveAndMint(proxyContract, tokenContract, owner);
      expect(await proxyContract.ownerOf(tokenID)).to.equal(owner.address);
    });
  });
});

const approveAndMint = async (proxyContract, tokenContract, owner) => {
  const tokenID = await proxyContract.getNextTokenID();
  await tokenContract.approve(proxyContract.target, await proxyContract.getPaymentPrice());
  await proxyContract.mintNFT(owner.address, mockingURI);
  return tokenID;
}