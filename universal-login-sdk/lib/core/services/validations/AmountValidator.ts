import {utils} from 'ethers';
import {DEFAULT_GAS_LIMIT, TransferDetails} from '@universal-login/commons';
import {Validator, TransferErrors} from './Validator';
import {NumberValidator} from './NumberValidator';

const {formatEther} = utils;

export class AmountValidator extends Validator<TransferDetails> {
  constructor(private readonly balance: string) {
    super();
  }

  validate(transferDetails: TransferDetails, errors: TransferErrors) {
    const {amount, transferToken} = transferDetails;
    if (!amount) {
      errors['amount'].push('Empty amount');
      return false;
    }
    const isNumber = new NumberValidator().validate(transferDetails, errors);
    if (!isNumber) {
      return false;
    }
    const {gasPrice, gasToken} = transferDetails.gasParameters;
    const amountAsBigNumber = utils.parseEther(amount);
    const balanceAsBigNumber = utils.parseEther(this.balance);
    const gasCostInWei = utils.bigNumberify(DEFAULT_GAS_LIMIT.toString()).mul(gasPrice);
    const amountWithFee = amountAsBigNumber.add(gasCostInWei);
    if (amountAsBigNumber.gt(balanceAsBigNumber)) {
      errors['amount'].push(`Insufficient funds. Sending ${formatEther(amountAsBigNumber)} eth, got only ${formatEther(balanceAsBigNumber)} eth`);
    } else if (gasToken === transferToken && amountWithFee.gt(balanceAsBigNumber)) {
      errors['amount'].push(`Insufficient funds. Sending ${formatEther(amountAsBigNumber)} eth + ${formatEther(gasCostInWei)} eth fee, got only ${formatEther(balanceAsBigNumber)} eth`);
    }
  }
}
