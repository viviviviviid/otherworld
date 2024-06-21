const { init } = require("./init");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);

  const proxyContract = await ethers.deployContract("Proxy");
  await proxyContract.waitForDeployment();
  console.log("Deployed Proxy Contract Address:", proxyContract.target);


  const logicContract = await ethers.deployContract("PaymentLogic");
  await logicContract.waitForDeployment();
  console.log("Deployed Logic Contract Address:", logicContract.target);


  const tokenContract = await ethers.deployContract("PaymentToken");
  await tokenContract.waitForDeployment();
  console.log("Deployed ERC20 Token Contract Address:", tokenContract.target);

  await init(proxyContract, logicContract, tokenContract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
