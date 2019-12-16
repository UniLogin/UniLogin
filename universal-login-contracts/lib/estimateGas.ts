import {utils} from 'ethers';
import {createFullHexString, ensure, SignedMessagePaymentOptions, Message, GasComputation, GAS_FIXED, NetworkVersion, WalletVersion} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';

export const calculateGasCall = (gasLimit: utils.BigNumberish, baseGas: utils.BigNumberish) => {
  const gasCall = utils.bigNumberify(gasLimit).sub(baseGas);
  ensure(gasCall.gt(0), Error, 'Gas limit too low');
  return gasCall;
};

export const calculateFinalGasLimit = (gasCall: utils.BigNumberish, baseGas: utils.BigNumberish) =>
  utils.bigNumberify(gasCall).add(baseGas).add('30000');

export const calculatePaymentOptions = (msg: SignedMessagePaymentOptions) =>
  ({gasLimit: calculateFinalGasLimit(msg.gasCall, msg.baseGas)});

export const calculatebaseGas = (message: Omit<Message, 'gasLimit'>, networkVersion: NetworkVersion, walletVersion: WalletVersion) => {
  const encodedMessage = encodeDataForExecuteSigned({
    ...message,
    gasCall: createFullHexString(3),
    baseGas: createFullHexString(3),
    signature: createFullHexString(65),
  });
  const gasData = new GasComputation(networkVersion).computeGasData(encodedMessage);
  return walletVersion === 'beta2' ? utils.bigNumberify(gasData).add(GAS_FIXED) : gasData;
};
