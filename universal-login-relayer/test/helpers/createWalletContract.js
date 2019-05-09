import { defaultDeployOptions } from '@universal-login/commons';
import LegacyWallet from '@universal-login/contracts/build/LegacyWallet.json';
import { ContractFactory } from 'ethers';

export default async function createWalletContract(wallet, ensService) {
  const factory = new ContractFactory(
    LegacyWallet.interface,
    `0x${LegacyWallet.evm.bytecode.object}`,
    wallet,
  );

  const args = [wallet.address, ...ensService.argsFor('alex.mylogin.eth')];
  return factory.deploy(...args, defaultDeployOptions);
}
