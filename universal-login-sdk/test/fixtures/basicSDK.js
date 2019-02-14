import EthereumIdentitySDK from '../../lib/sdk';
import RelayerUnderTest from 'universal-login-relayer/build/utils/relayerUnderTest';
import {getWallets, deployContract} from 'ethereum-waffle';
import {utils, ContractFactory} from 'ethers';
import path from 'path';
import Identity from 'universal-login-contracts/build/Identity';
import MockToken from 'universal-login-contracts/build/MockToken';
import MESSAGE_DEFAULTS from '../../lib/config';

export default async function basicIdentityService(wallet) {
  let {provider} = wallet;
  const [, otherWallet, otherWallet2] = await getWallets(provider);
  const relayer = await RelayerUnderTest.createPreconfigured(provider);
  await relayer.start();
  ({provider} = relayer);
  const sdk = new EthereumIdentitySDK(relayer.url(), provider);
  const [privateKey, contractAddress] = await sdk.create('alex.mylogin.eth');
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
  const factory = new ContractFactory(Identity.abi, Identity.bytecode, wallet);
  const identity = await factory.attach(contractAddress);
  return {wallet, provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, identity, relayer};
}

export const transferMessage = {
  ...MESSAGE_DEFAULTS,
  to: '0x0000000000000000000000000000000000000001',
  value: utils.parseEther('0.5').toString(),
};
