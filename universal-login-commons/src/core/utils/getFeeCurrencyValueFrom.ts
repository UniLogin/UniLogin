import {utils} from 'ethers';
import {SignedMessage} from '../models/message';
import {CurrencyValue} from '../models/CurrencyValue';

export const getFeeCurrencyValueFrom = (signedMessage: SignedMessage): CurrencyValue => {
  const gasLimit = utils.bigNumberify(signedMessage.safeTxGas).add(signedMessage.baseGas);
  return CurrencyValue.fromWei(gasLimit.mul(signedMessage.gasPrice), signedMessage.gasToken);
};
