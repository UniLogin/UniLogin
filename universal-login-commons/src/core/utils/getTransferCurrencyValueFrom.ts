import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {SignedMessage} from '../models/message';
import {Nullable} from '../types/common';
import {TokenDetailsWithBalance} from '../models/TokenData';
import {ETHER_NATIVE_TOKEN} from '../constants/constants';
import {isDataForFunctionCall} from './isDataForFunctionCall';
import {Abi} from '../models/ContractJSON';

export const getTransferCurrencyValueFrom = (signedMessage: SignedMessage): Nullable<Pick<TokenDetailsWithBalance, 'address' | 'balance'>> => {
  const value = utils.bigNumberify(signedMessage.value);
  if (value.gt('0')) {
    return {
      address: ETHER_NATIVE_TOKEN.address,
      balance: value,
    };
  } else {
    const data = signedMessage.data.toString();
    const ierc20Interface = new utils.Interface(IERC20.abi as Abi);
    if (isDataForFunctionCall(data, ierc20Interface, 'transfer')) {
      return {
        address: signedMessage.to,
        balance: new utils.AbiCoder((_, value) => value).decode(
          ['address', 'uint256'],
          `0x${data.slice(10)}`,
        )[1],
      };
    } else {
      return null;
    }
  }
};
