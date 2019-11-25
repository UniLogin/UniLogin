import {Contract, providers, utils} from 'ethers';
import {WALLET_MASTER_VERSIONS, ensureNotNull} from '@universal-login/commons';
import {WalletProxyInterface} from './interfaces';

export async function fetchWalletVersion(contractAddress: string, provider: providers.Provider) {
  const proxyInstance = new Contract(contractAddress, WalletProxyInterface, provider);
  const walletMasterAddress = await proxyInstance.implementation();
  const walletMasterBytecode = await provider.getCode(walletMasterAddress);
  const walletMasterVersion = WALLET_MASTER_VERSIONS[utils.keccak256(walletMasterBytecode)];
  ensureNotNull(walletMasterVersion, Error, 'Unsupported wallet master version');
  return walletMasterVersion;
}
