import {providers} from 'ethers';

export interface IMinedTransactionHandler {
  handle(sentTransaction: providers.TransactionResponse): Promise<void>;
}
