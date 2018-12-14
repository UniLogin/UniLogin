import Clicker from '../../build/Clicker';
import Token from '../../build/Token';
import {RelayerUnderTest} from 'universal-login-relayer/build';
import {deployContract} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';

export default async function basicEnvironment(wallet) {
  let {provider} = wallet;
  const relayer = await RelayerUnderTest.createPreconfigured(provider);
  await relayer.start();
  ({provider} = relayer);
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  const clickerContract = await deployContract(wallet, Clicker);
  const tokenContract = await deployContract(wallet, Token);
  return {wallet, clickerContract, tokenContract, relayer, sdk};
}
