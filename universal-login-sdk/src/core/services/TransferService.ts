import {ensureNotFalsy, GasParameters, Nullable, TransferDetails, SEND_TRANSACTION_GAS_LIMIT, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {utils} from 'ethers';
import {DeployedWithoutEmailWallet} from '../..';
import {bigNumberMax} from '../utils/bigNumberMax';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {WalletNotFound} from '../utils/errors';
import {getTargetAddress} from '../utils/getTargetAddress';
import {AmountValidator} from './validations/AmountValidator';
import {RecipientValidator} from './validations/RecipientValidator';
import {ChainValidator} from './validations/ChainValidator';
import {OnBalanceChange} from '../observers/BalanceObserver';

export type TransferErrors = Record<string, string[]>;

export class TransferService {
  private errors: TransferErrors = {amount: [], to: []};

  constructor(public deployedWallet: DeployedWithoutEmailWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotFalsy(this.deployedWallet, WalletNotFound);
    const targetAddress = await getTargetAddress(this.deployedWallet.sdk, transferDetails.to);
    const message = encodeTransferToMessage({
      ...transferDetails,
      to: targetAddress,
      from: this.deployedWallet.contractAddress,
      gasLimit: SEND_TRANSACTION_GAS_LIMIT,
    });
    return this.deployedWallet.execute(message);
  }

  async validateInputs(transferDetails: TransferDetails, balance: Nullable<string>) {
    this.errors = {amount: [], to: []};
    ensureNotFalsy(balance, Error, 'Balance is null');
    await new ChainValidator([
      new AmountValidator(balance),
      new RecipientValidator(this.deployedWallet.sdk),
    ]).validate(transferDetails, this.errors);
    return this.errors;
  }

  areInputsValid() {
    return this.errors.amount.length === 0 && this.errors.to.length === 0;
  }

  getMaxAmount(gasParameters: GasParameters, balance: Nullable<string>) {
    ensureNotFalsy(balance, Error, 'Balance is null');
    const {gasPrice, gasToken} = gasParameters;
    if (gasToken !== ETHER_NATIVE_TOKEN.address) {
      return balance;
    }
    const gasCostInWei = utils.bigNumberify(SEND_TRANSACTION_GAS_LIMIT.toString()).mul(gasPrice);
    const maxAmountAsBigNumber = utils.parseEther(balance).sub(gasCostInWei);
    const maxAmountValidated = bigNumberMax(maxAmountAsBigNumber, utils.parseEther('0'));
    return utils.formatEther(maxAmountValidated);
  }

  getTokenDetails(tokenAddress: string) {
    return this.deployedWallet.sdk.tokensDetailsStore.getTokenBy('address', tokenAddress);
  }

  subscribeToBalances(callback: OnBalanceChange) {
    return this.deployedWallet.subscribeToBalances(callback);
  }
}
