import {Contract, providers, utils} from 'ethers';
import {CONTRACT_VERSIONS} from '@universal-login/commons';
import {WalletProxyInterface} from './interfaces';

export async function fetchWalletVersion(contractAddress: string, provider: providers.Provider) {
  const proxyInstance = new Contract(contractAddress, WalletProxyInterface, provider);
  const walletMasterAddress = await proxyInstance.implementation();
  const walletMasterBytecode = await provider.getCode(walletMasterAddress);
  return CONTRACT_VERSIONS[utils.keccak256(walletMasterBytecode)];
}
