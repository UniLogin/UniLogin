import { defaultDeployOptions } from '@universal-login/commons';
import LegacyWallet from '@universal-login/contracts/build/LegacyWallet.json';
import buildEnsService from './buildEnsService';
import { ContractFactory } from 'ethers';

export default async function createWalletContract(wallet) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');

  const factory = new ContractFactory(
    LegacyWallet.interface,
    `0x${LegacyWallet.evm.bytecode.object}`,
    wallet,
  );

  const args = [wallet.address, ...ensService.argsFor('alex.mylogin.eth')];
  const walletContract = await factory.deploy(...args, defaultDeployOptions);

  return { ensService, walletContract, provider };
}
