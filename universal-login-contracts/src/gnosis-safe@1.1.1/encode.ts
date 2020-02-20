import {SignedMessage} from '@unilogin/commons';
import {GnosisSafeInterface} from './interfaces';

export const encodeDataForExecTransaction = (message: SignedMessage) =>
  GnosisSafeInterface.functions.execTransaction.encode([
    message.to,
    message.value,
    message.data,
    message.operationType,
    message.safeTxGas,
    message.baseGas,
    message.gasPrice,
    message.gasToken,
    message.refundReceiver,
    message.signature,
  ]);

interface Deployment {
  owners: string[];
  requiredConfirmations: number;
  deploymentCallAddress: string;
  deploymentCallData: string;
  fallbackHandler: string;
  paymentToken: string;
  payment: string;
  refundReceiver: string;
};

export const encodeDataForSetup = (deployment: Deployment) =>
  GnosisSafeInterface.functions.setup.encode([
    deployment.owners,
    deployment.requiredConfirmations,
    deployment.deploymentCallAddress,
    deployment.deploymentCallData,
    deployment.fallbackHandler,
    deployment.paymentToken,
    deployment.payment,
    deployment.refundReceiver,
  ]);
