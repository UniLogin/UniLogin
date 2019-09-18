import {utils, providers} from 'ethers';
import {SignedMessage, ensure} from '@universal-login/commons';
import {NotEnoughGas} from '../../core/utils/errors';

export const ensureEnoughGas = async (provider: providers.Provider, walletAddress: string, transaction: providers.TransactionRequest, message: SignedMessage) => {
  const estimateGas = await provider.estimateGas({ ...transaction, from: walletAddress });
  ensure(utils.bigNumberify(message.gasLimitExecution as utils.BigNumberish).gte(estimateGas), NotEnoughGas); // TODO Add gasData to gasLimitExecution !!!!
};
