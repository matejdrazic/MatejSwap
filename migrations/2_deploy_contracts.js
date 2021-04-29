const FesbToken = artifacts.require("FesbToken");
const MatejSwap = artifacts.require("MatejSwap");
const MatejSwapLP = artifacts.require("MatejSwapLP");

module.exports = async function(deployer) {
  await deployer.deploy(FesbToken);
  const fesbtoken = await FesbToken.deployed();

  await deployer.deploy(MatejSwap, fesbtoken.address);
  const matejswap = await MatejSwap.deployed();

  await deployer.deploy(MatejSwapLP);
  const matejswapLP = await MatejSwapLP.deployed();
};
