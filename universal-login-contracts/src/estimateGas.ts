import {utils} from 'ethers';
import {createFullHexString, ensure, Message, GasDataComputation, GAS_FIXED, NetworkVersion, WalletVersion, CONSTANT_EXECUTION_COSTS, SIGNATURE_CHECK_COST, ZERO_NONCE_COST} from '@unilogin/commons';
import {encodeDataForExecuteSigned} from './beta2/encode';

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
  switch (walletVersion) {
    case 'beta1':
      return gasData;
    case 'beta2':
      return utils.bigNumberify(gasData).add(GAS_FIXED);
    case 'beta3':
      return utils.bigNumberify(gasData).add(ZERO_NONCE_COST).add(SIGNATURE_CHECK_COST).add(CONSTANT_EXECUTION_COSTS);
    default:
      throw TypeError(`Invalid wallet version: ${walletVersion}`);
  }
};
