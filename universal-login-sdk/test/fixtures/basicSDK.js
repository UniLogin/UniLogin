import UniversalLoginSDK from '../../lib/sdk';
import {RelayerUnderTest} from '@universal-login/relayer';
import {deployContract} from 'ethereum-waffle';
import {utils, ContractFactory} from 'ethers';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import MockToken from '@universal-login/contracts/build/MockToken';
import MESSAGE_DEFAULTS from '../../lib/config';

export default async function basicWalletService(givenProvider, wallets) {
  const [wallet, otherWallet, otherWallet2, deployer] = wallets;
  const relayer = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  const [privateKey, contractAddress] = await sdk.create('alex.mylogin.eth');
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
  const factory = new ContractFactory(WalletContract.abi, WalletContract.bytecode, wallet);
  const walletContract = await factory.attach(contractAddress);
  return {wallet, provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, walletContract, relayer};
}

export const transferMessage = {
  ...MESSAGE_DEFAULTS,
  to: '0x0000000000000000000000000000000000000001',
  value: utils.parseEther('0.5').toString(),
};
