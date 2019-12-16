import {utils} from 'ethers';
import {ensureNotNull, TransferDetails, isValidRecipient, isValidAmount, DEFAULT_GAS_LIMIT, Nullable, GasParameters, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {WalletNotFound} from '../utils/errors';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {getTargetAddress} from '../utils/getTargetAddress';
import {bigNumberMax} from '../utils/bigNumberMax';

export type TransferErrors = Record<string, string[]>;

export class TransferService {
  private errors: TransferErrors = {amount: [], to: []};

  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotNull(this.deployedWallet, WalletNotFound);
    const targetAddress = await getTargetAddress(this.deployedWallet.sdk, transferDetails.to);
    const message = encodeTransferToMessage({...transferDetails, to: targetAddress, from: this.deployedWallet.contractAddress});
    return this.deployedWallet.execute(message);
  }

  validateInputs(transferDetails: TransferDetails, balance: Nullable<string>) {
    this.errors = {amount: [], to: []};
    const {gasPrice, gasToken} = transferDetails.gasParameters;
    const gasCostInWei = utils.bigNumberify(DEFAULT_GAS_LIMIT.toString()).mul(gasPrice);
    ensureNotNull(balance, Error, 'Balance is null');
    const isAmountValid = isValidAmount(transferDetails.transferToken, balance, gasToken, gasCostInWei, transferDetails.amount);
    if (!isAmountValid) {
      this.errors.amount.push(`Amount ${transferDetails.amount} is not valid`);
    }
    const isRecipientValid = isValidRecipient(transferDetails.to);
    if (!isRecipientValid) {
      this.errors.to.push(`Recipient ${transferDetails.to} is not valid`);
    }
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
}
