import {DEFAULT_GAS_LIMIT, ensureNotNull, ETHER_NATIVE_TOKEN, GasParameters, Nullable, TransferDetails} from '@universal-login/commons';
import {utils} from 'ethers';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {bigNumberMax} from '../utils/bigNumberMax';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {WalletNotFound} from '../utils/errors';
import {getTargetAddress} from '../utils/getTargetAddress';
import {AmountValidator} from './validations/AmountValidator';
import {RecipientValidator} from './validations/RecipientValidator';
import {ChainValidator} from './validations/ChainValidator';

export type TransferErrors = Record<string, string[]>;

export class TransferService {
  private errors: TransferErrors = {amount: [], to: []};

  constructor(public deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotNull(this.deployedWallet, WalletNotFound);
    const targetAddress = await getTargetAddress(this.deployedWallet.sdk, transferDetails.to);
    const message = encodeTransferToMessage({...transferDetails, to: targetAddress, from: this.deployedWallet.contractAddress});
    return this.deployedWallet.execute(message);
  }

  async validateInputs(transferDetails: TransferDetails, balance: Nullable<string>) {
    this.errors = {amount: [], to: []};
    ensureNotNull(balance, Error, 'Balance is null');
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
    ensureNotNull(balance, Error, 'Balance is null');
    const {gasPrice, gasToken} = gasParameters;
    if (gasToken !== ETHER_NATIVE_TOKEN.address) {
      return balance;
    }
    const gasCostInWei = utils.bigNumberify(DEFAULT_GAS_LIMIT.toString()).mul(gasPrice);
    const maxAmountAsBigNumber = utils.parseEther(balance).sub(gasCostInWei);
    const maxAmountValidated = bigNumberMax(maxAmountAsBigNumber, utils.parseEther('0'));
    return utils.formatEther(maxAmountValidated);
  }

  getTokenDetails(tokenAddress: string) {
    return this.deployedWallet.sdk.tokensDetailsStore.getTokenByAddress(tokenAddress);
  }
}
