import {utils} from 'ethers';
import {ensure, ensureNotNull, TransferDetails, isValidRecipient, isValidAmount, DEFAULT_GAS_LIMIT, Nullable} from '@universal-login/commons';
import {InvalidAddressOrEnsName, WalletNotFound, InvalidAmount, InvalidAmountAndRecipient} from '../utils/errors';
import {DeployedWallet} from '../../api/DeployedWallet';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {getTargetAddress} from '../utils/getTargetAddress';

export class TransferService {
  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotNull(this.deployedWallet, WalletNotFound);
    const targetAddress = await getTargetAddress(this.deployedWallet.sdk, transferDetails.to);
    const message = encodeTransferToMessage({...transferDetails, to: targetAddress, from: this.deployedWallet.contractAddress});
    return this.deployedWallet.execute(message);
  }

  validateInputs(transferDetails: TransferDetails, balance: Nullable<string>) {
    const gasCostInWei = utils.bigNumberify(DEFAULT_GAS_LIMIT.toString()).mul(transferDetails.gasParameters.gasPrice);
    ensureNotNull(balance, Error, 'Balance is null');
    const isAmountValid = isValidAmount(transferDetails.transferToken, balance, gasCostInWei, transferDetails.amount);
    const isRecipientValid = isValidRecipient(transferDetails.to);
    ensure(isAmountValid || isRecipientValid, InvalidAmountAndRecipient, transferDetails.amount, transferDetails.to);
    ensure(isAmountValid, InvalidAmount, transferDetails.amount);
    ensure(isRecipientValid, InvalidAddressOrEnsName, transferDetails.to);
  }
}
