const Token = require('../../build/Token');
const {deployContract} = require('ethereum-waffle');

async function deployToken(deployWallet) {
  const {address} = await deployContract(deployWallet, Token);
  console.log(`Token contract address: ${address}`);
  return address;
}

module.exports = deployToken;
