import {SignedMessage} from '@universal-login/commons';
import {GnosisSafeInterface} from './interfaces';

export const encodeDataForExecTransaction = (message: SignedMessage) =>
  GnosisSafeInterface.functions.execTransaction.encode([
    message.to,
    message.value,
    message.data,
    message.operationType,
    message.gasPrice,
    message.gasToken,
    message.safeTxGas,
    message.baseGas,
    message.refundReceiver,
    message.signature,
  ]);
