import {utils} from 'ethers';
import {DEFAULT_GAS_LIMIT, TransferDetails} from '@universal-login/commons';
import {Validator, TransferErrors} from './Validator';

const {formatEther} = utils;

const isNumber = /^[0-9]+(\.[0-9]+)?$/;

export class AmountValidator extends Validator<TransferDetails> {
  constructor(private readonly balance: string) {
    super();
  }

  validate(transferDetails: TransferDetails, errors: TransferErrors) {
    const {amount, transferToken} = transferDetails;
    if (!amount.match(isNumber)) {
      errors['amount'].push(`Amount ${transferDetails.amount} is not a valid number`);
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
      errors['amount'].push(`Insufficient funds. Sending ${formatEther(amountAsBigNumber)} eth, got only ${formatEther(balanceAsBigNumber)} eth + ${formatEther(gasCostInWei)} eth fee`);
    }
  }
}
