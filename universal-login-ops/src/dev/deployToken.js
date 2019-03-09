import Token from '../contracts/Token.json';
import {deployContract} from 'ethereum-waffle';

async function deployToken(deployWallet) {
  const {address} = await deployContract(deployWallet, Token);
  console.log(`       Token address: ${address}`);
  return address;
}

module.exports = deployToken;
