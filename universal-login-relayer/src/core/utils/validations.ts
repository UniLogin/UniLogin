import {ensure} from '@unilogin/commons';
import {InvalidTransaction} from './errors';

export const ensureProperTransactionHash = (transactionHash: string) => ensure(transactionHash.length === 66, InvalidTransaction, transactionHash);
