import {utils} from 'ethers';
import {SignedMessage} from '../models/message';
import {TokenDetailsWithBalance} from '../models/TokenData';

export const getGasToken = (signedMessage: SignedMessage): Pick<TokenDetailsWithBalance, 'address' | 'balance'> => {
  const gasLimit = utils.bigNumberify(signedMessage.safeTxGas).add(signedMessage.baseGas);
  return {
    address: signedMessage.gasToken,
    balance: gasLimit.mul(signedMessage.gasPrice),
  };
};
