import {utils} from 'ethers';
import {createFullHexString, ensure, Message, GasDataComputation, GAS_FIXED, NetworkVersion, WalletVersion} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from './encode';

export const calculateSafeTxGas = (gasLimit: utils.BigNumberish, baseGas: utils.BigNumberish) => {
  const safeTxGas = utils.bigNumberify(gasLimit).sub(baseGas);
  ensure(safeTxGas.gt(0), Error, 'Gas limit too low');
  return safeTxGas;
};

export const calculateBaseGas = (message: Omit<Message, 'gasLimit'>, networkVersion: NetworkVersion, walletVersion: WalletVersion) => {
  const encodedMessage = encodeDataForExecuteSigned({
    ...message,
    safeTxGas: createFullHexString(3),
    baseGas: createFullHexString(3),
    signature: createFullHexString(65),
  });
  const gasData = new GasDataComputation(networkVersion).computeGasData(encodedMessage);
  return walletVersion === 'beta2' ? utils.bigNumberify(gasData).add(GAS_FIXED) : gasData;
};
