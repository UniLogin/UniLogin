import {utils} from 'ethers';
import {ensure, ensureNotNull, TransferDetails, isValidRecipient, isValidAmount, DEFAULT_GAS_LIMIT, Nullable, GasParameters, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {InvalidAddressOrEnsName, WalletNotFound, InvalidAmount, InvalidAmountAndRecipient} from '../utils/errors';
import {DeployedWallet} from '../../api/wallet/DeployedWallet';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {getTargetAddress} from '../utils/getTargetAddress';
import {isBiggerThan} from '../utils/isBiggerThan';

export class TransferService {
  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotNull(this.deployedWallet, WalletNotFound);
    const targetAddress = await getTargetAddress(this.deployedWallet.sdk, transferDetails.to);
    const message = encodeTransferToMessage({...transferDetails, to: targetAddress, from: this.deployedWallet.contractAddress});
    return this.deployedWallet.execute(message);
  }

  validateInputs(transferDetails: TransferDetails, balance: Nullable<string>) {
    const {gasPrice, gasToken} = transferDetails.gasParameters;
    const gasCostInWei = utils.bigNumberify(DEFAULT_GAS_LIMIT.toString()).mul(gasPrice);
    ensureNotNull(balance, Error, 'Balance is null');
    const isAmountValid = isValidAmount(transferDetails.transferToken, balance, gasToken, gasCostInWei, transferDetails.amount);
    const isRecipientValid = isValidRecipient(transferDetails.to);
    ensure(isAmountValid || isRecipientValid, InvalidAmountAndRecipient, transferDetails.amount, transferDetails.to);
    ensure(isAmountValid, InvalidAmount, transferDetails.amount);
    ensure(isRecipientValid, InvalidAddressOrEnsName, transferDetails.to);
  }

  getEtherMaxAmount(gasParameters: GasParameters, balance: Nullable<string>) {
    ensureNotNull(balance, Error, 'Balance is null');
    const {gasPrice, gasToken} = gasParameters;
    if (gasToken !== ETHER_NATIVE_TOKEN.address) {
      return balance;
    }
    const gasCostInWei = utils.bigNumberify(DEFAULT_GAS_LIMIT.toString()).mul(gasPrice);
    const maxAmountAsBigNumber = utils.parseEther(balance).sub(gasCostInWei);
    const maxAmountValidated = isBiggerThan(maxAmountAsBigNumber, utils.parseEther('0'));
    return utils.formatEther(maxAmountValidated);
  }
}
