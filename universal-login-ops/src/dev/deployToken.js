import Token from '../contracts/Token.json';
import Create2Factory from 'universal-login-contracts/contracts/create2/Create2Factory';
import {deployContract} from 'ethereum-waffle';

async function deployToken(deployWallet) {
  const {address} = await deployContract(deployWallet, Token);
  console.log(`Token contract address: ${address}`);
  return address;
}

module.exports = deployToken;
