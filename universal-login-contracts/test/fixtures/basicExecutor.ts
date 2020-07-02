import Executor from '../../dist/contracts/TestableExecutor.json';
import MockToken from '../../dist/contracts/MockToken.json';
import MockContract from '../../dist/contracts/MockContract.json';
import {utils, Wallet} from 'ethers';
import {deployContract, MockProvider} from 'ethereum-waffle';
import {sortPrivateKeysByAddress, createKeyPair} from '@unilogin/commons';
const {parseEther} = utils;

export default async function basicExecutor(provider: MockProvider, [, , , , , , , , , wallet]: Wallet []) {
  const managementKeyPair = {publicKey: wallet.address, privateKey: wallet.privateKey};
  const actionKeyPair = createKeyPair();
  const actionKeyPair2 = createKeyPair();
  const sortedKeys = sortPrivateKeysByAddress([actionKeyPair2.privateKey, actionKeyPair.privateKey, managementKeyPair.privateKey]);
  const walletContract = await deployContract(wallet, Executor, [managementKeyPair.publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: walletContract.address, value: parseEther('2.0')});
  await mockToken.transfer(walletContract.address, parseEther('1.0'));
  await walletContract.addKey(actionKeyPair.publicKey);
  await walletContract.addKey(actionKeyPair2.publicKey);
  return {provider, managementKeyPair, sortedKeys, walletContract, mockToken, mockContract, wallet};
}
