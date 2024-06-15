const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

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
  const [owner, addr1, addr2] = await ethers.getSigners();
  const proxyContract = await ethers.deployContract("Proxy");
  await proxyContract.waitForDeployment();

  const {tokenContract, logicContract} = await deploySubContracts();
  const initTokenPrice = 34985238;
  await proxyContract.initialize(tokenContract.target, initTokenPrice, logicContract.target)

  return { proxyContract, tokenContract, logicContract, owner, initTokenPrice};
}

const deploySubContracts = async () => {
  const tokenContract = await ethers.deployContract("PaymentToken");
  await tokenContract.waitForDeployment();
  const logicContract = await ethers.deployContract("PaymentLogic");
  await logicContract.waitForDeployment();

  return {tokenContract, logicContract};
}

describe("Token contract", () => {
  it("Should assign the total supply of tokens to the owner", async () => {
    const { tokenContract, owner } = await loadFixture(deployTokenFixture);
    const ownerBalance = await tokenContract.balanceOf(owner.address);
    expect(await tokenContract.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async () => {
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
  it("Should generate random numbers from 0 to 99 using a Linear Congruential Generator based on a seed.", async () => {
    const { logicContract, owner } = await loadFixture(deployLogicFixture);
    let values = [];
    
    for (let i = 0; i < 10; i++) {
      await logicContract.calculatePrice();
      let temp = await logicContract.getPaymentPrice();
      values.push(temp); 
    }

    // Check if all values are the same
    const allSame = values.every((val, _, arr) => val === arr[0]);
    expect(allSame).to.be.false;
  });
});

describe("Proxy Contract", () =>  {

  describe("Contract Initialize", () => {
    it("Should init token contract", async () => {
      const { proxyContract, tokenContract } = await loadFixture(deployProxyFixture);
      await expect(await proxyContract.getTokenContract()).to.equal(tokenContract.target);
      
    });

    it("Should init right logic contract", async () => {
      const { proxyContract, logicContract } = await loadFixture(deployProxyFixture);
      await expect(await proxyContract.getLogicContract()).to.equal(logicContract.target);
    });

    it("Should init right payment price", async () => {
      const { proxyContract , initTokenPrice} = await loadFixture(deployProxyFixture);
      await expect(await proxyContract.getPaymentPrice()).to.equal(initTokenPrice);
    });
  });

  describe("Excute DelegateCall", () => {
    it("Should match the price calculated directly with the price after using `delegateCall`", async () => {
      // const { proxyContract, owner } = await loadFixture(deployProxyFixture);
    });
  });

  describe("Upgrade Logic Contract", () => {
    it("Should correctly upgrade the new contract address", async () => {
      // const { proxyContract, owner } = await loadFixture(deployProxyFixture);
    });
  });

  describe("Mint NFT", () => {
    it("Should correctly update the wallet balance after NFT mint", async () => {
      // const { proxyContract, owner } = await loadFixture(deployProxyFixture);
      // 가격 업데이트 후
      // approve
      //
    });

    it("Should include the URI in the token metadata", async () => {
      // const { proxyContract, owner } = await loadFixture(deployProxyFixture);
    });

    it("Should increment the token ID by 1 after minting", async () => {
      // const { proxyContract, owner } = await loadFixture(deployProxyFixture);
      // 가격 업데이트 후
      // 먼저 nextId 먼저 저장, NFT 민트 이후 nextId값이 1 올라갔는지 확인.
    });

    it("Should match the token owner with `msg.sender`", async () => {
      // const { proxyContract, owner } = await loadFixture(deployProxyFixture);
    });
  });

});
