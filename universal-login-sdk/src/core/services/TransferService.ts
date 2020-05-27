import {ensureNotFalsy, GasParameters, Nullable, TransferDetails, SEND_TRANSACTION_GAS_LIMIT, ETHER_NATIVE_TOKEN, isDataForFunctionCall, Message} from '@unilogin/commons';
import {utils} from 'ethers';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {bigNumberMax} from '../utils/bigNumberMax';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {WalletNotFound} from '../utils/errors';
import {getTargetAddress} from '../utils/getTargetAddress';
import {AmountValidator} from './validations/AmountValidator';
import {RecipientValidator} from './validations/RecipientValidator';
import {ChainValidator} from './validations/ChainValidator';
import {OnBalanceChange} from '../observers/BalanceObserver';
import {IERC20Interface} from '@unilogin/contracts';

export type TransferErrors = Record<string, string[]>;

export class TransferService {
  private errors: TransferErrors = {amount: [], to: []};

  constructor(public deployedWallet: DeployedWallet) {}

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

  fetchTokenDetails(tokenAddress: string) {
    return this.deployedWallet.sdk.tokenDetailsService.getTokenDetails(tokenAddress);
  }

  async getTransferDetails(transferDetails: Pick<Message, 'to' | 'value' | 'data'>) {
    if (transferDetails.data && isDataForFunctionCall(transferDetails.data.toString(), IERC20Interface, 'transfer')) {
      const tokenTransfer = new utils.AbiCoder((_, value) => value).decode(
        ['address', 'uint256'],
        `0x${transferDetails.data.toString().slice(10)}`,
      );
      return {
        tokenDetails: await this.fetchTokenDetails(transferDetails.to),
        targetAddress: tokenTransfer[0],
        value: tokenTransfer[1].toString(),
      };
    }
    return {
      targetAddress: transferDetails.to,
      value: transferDetails.value,
      tokenDetails: ETHER_NATIVE_TOKEN,
    };
  }
}
