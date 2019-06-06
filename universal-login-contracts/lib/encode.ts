import {utils} from 'ethers';
import {Message} from '@universal-login/commons';
import WalletMaster from '../build/WalletMaster.json';

export const encodeInitializeWithENSData = (args: string[]) => new utils.Interface(WalletMaster.interface).functions.initializeWithENS.encode(args);

export const encodeInitializeData = (publicKey: string) => new utils.Interface(WalletMaster.interface).functions.initialize.encode([publicKey]);


const {executeSigned} = new utils.Interface(WalletMaster.interface).functions;

export const encodeDataForExecuteSigned = (message: Message) =>
  executeSigned.encode([
    message.to,
    message.value,
    message.data,
    message.nonce,
    message.gasPrice,
    message.gasToken,
    message.gasLimit,
    message.operationType,
    message.signature
  ]);
