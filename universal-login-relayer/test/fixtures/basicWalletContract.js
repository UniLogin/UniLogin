import { utils } from 'ethers';
import { OPERATION_CALL, ACTION_KEY } from '@universal-login/contracts';
import WalletContract from '@universal-login/contracts/build/Wallet';
import defaultPaymentOptions from '../../lib/config/defaultPaymentOptions';
import createWalletContract from '../helpers/createWalletContract';
import buildEnsService from '../helpers/buildEnsService';

const { gasPrice, gasLimit } = defaultPaymentOptions;

export default async function basicWalletContract(provider, [, , wallet]) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const walletContract = await createWalletContract(wallet, ensService);
  return { wallet, provider, walletContract, ensService };
}

export const transferMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: utils.parseEther('0.5'),
  data: utils.formatBytes32String(0),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

export const addKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: new utils.Interface(WalletContract.interface).functions.addKey.encode(['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0', ACTION_KEY]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

export const removeKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: new utils.Interface(WalletContract.interface).functions.removeKey.encode(['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0', ACTION_KEY]),
  nonce: 1,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};
