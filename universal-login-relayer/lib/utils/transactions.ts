import {utils} from 'ethers';
import {Message} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/Wallet.json';

export const encodeDataForExecuteSigned = (message: Message) =>
new utils.Interface(WalletContract.interface)
  .functions.executeSigned
  .encode([message.to, message.value, message.data, message.nonce, message.gasPrice, message.gasToken, message.gasLimit, message.operationType, message.signature]);
