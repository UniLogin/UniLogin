import { defaultDeployOptions } from '@universal-login/commons';
import Wallet from '@universal-login/contracts/build/Wallet.json';
import { ContractFactory } from 'ethers';

export default async function createWalletContract(wallet, ensService) {
  const factory = new ContractFactory(
    Wallet.interface,
    `0x${Wallet.evm.bytecode.object}`,
    wallet,
  );

  const args = [wallet.address, ...ensService.argsFor('alex.mylogin.eth')];
  return factory.deploy(...args, defaultDeployOptions);
}
