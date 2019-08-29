import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {ACTION_KEY, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import WalletMaster from '@universal-login/contracts/build/Wallet.json';
import defaultPaymentOptions from '../../lib/config/defaultPaymentOptions';
import createWalletContract from '../helpers/createWalletContract';
import buildEnsService from '../helpers/buildEnsService';
import {deployFactory} from '@universal-login/contracts';

const {gasPrice, gasLimit} = defaultPaymentOptions;

export default async function basicWalletContract(provider, wallets) {
  const [ , , wallet] = wallets;
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const walletContract = await deployContract(wallet, WalletMaster);
  const factoryContract = await deployFactory(wallet, walletContract.address);
  const walletContract = await createWalletContract(wallet);
  return {wallet, provider, walletContract, ensService, walletMasterAddress: walletContract.address, factoryContractAddress: factoryContract.address};
}

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: utils.formatBytes32String('0'),
  nonce: '0',
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

export const addKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: new utils.Interface(WalletMaster.interface).functions.addKey.encode(['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0', ACTION_KEY]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

export const removeKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: new utils.Interface(WalletMaster.interface).functions.removeKey.encode(['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0', ACTION_KEY]),
  nonce: 1,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};
