const init = async (proxyContract, logicContract, tokenContract) => {
  const initMintPrice = 10;

  await proxyContract.initialize(tokenContract.target, initMintPrice, logicContract.target)
  await proxyContract.updatePaymentPrice();

  console.log(await proxyContract.getPaymentPrice());
}

module.exports = { init };