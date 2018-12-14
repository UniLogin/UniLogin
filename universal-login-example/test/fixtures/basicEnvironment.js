import Clicker from '../../build/Clicker';
import Token from '../../build/Token';
import {deployContract} from 'ethereum-waffle';

export default async function basicEnvironment(wallet) {
  let {provider} = wallet;
  const clickerContract = await deployContract(wallet, Clicker);
  const tokenContract = await deployContract(wallet, Token);
  return {wallet, clickerContract, tokenContract};
}
