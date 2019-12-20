import {utils} from 'ethers';
import {SignedMessage} from '@universal-login/commons';
import {WalletContract} from './contracts';

export const encodeInitializeWithENSData = (args: string[]) => WalletContractInterface.functions.initializeWithENS.encode(args);

export const encodeInitializeData = (args: string[]) => WalletContractInterface.functions.initialize.encode(args);

const WalletContractInterface = new utils.Interface(WalletContract.interface);
const {executeSigned} = WalletContractInterface.functions;

export const encodeDataForExecuteSigned = (message: SignedMessage) =>
  executeSigned.encode([
    message.to,
    message.value,
    message.data,
    message.gasPrice,
    message.gasToken,
    message.safeTxGas,
    message.baseGas,
    message.signature,
  ]);
