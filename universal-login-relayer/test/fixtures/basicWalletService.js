import buildEnsService from '../helpers/buildEnsService';
import {EventEmitter} from 'fbemitter';
import AuthorisationService from '../../lib/services/authorisationService';
import WalletService from '../../lib/services/WalletService';
import sinon from 'sinon';
import MockToken from 'universal-login-contracts/build/MockToken';
import MockContract from 'universal-login-contracts/build/MockContract';
import {deployContract, getWallets} from 'ethereum-waffle';
import defaultPaymentOptions from '../../lib/config/defaultPaymentOptions';
import {utils} from 'ethers';
import {OPERATION_CALL, ACTION_KEY} from 'universal-login-contracts';
import WalletContract from 'universal-login-contracts/build/WalletContract';
import {waitForContractDeploy} from 'universal-login-commons';
import {getKnex} from '../../lib/utils/knexUtils';

const {gasPrice, gasLimit} = defaultPaymentOptions;

export default async function basicWalletService(provider, [wallet]) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const hooks = new EventEmitter();
  const authorisationService = new AuthorisationService(getKnex());
  const walletContractService = new WalletService(wallet, ensService, authorisationService, hooks, provider, {legacyENS: true});
  const callback = sinon.spy();
  hooks.addListener('created', callback);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  const transaction = await walletContractService.create(wallet.address, 'alex.mylogin.eth');
  const walletContract = await waitForContractDeploy(wallet, WalletContract, transaction.hash);
  await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  await mockToken.transfer(walletContract.address, utils.parseEther('1.0'));
  const [, otherWallet] = await getWallets(provider);
  return {wallet, ensService, provider, walletContractService, callback, mockToken, mockContract, authorisationService, walletContract, otherWallet};
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
