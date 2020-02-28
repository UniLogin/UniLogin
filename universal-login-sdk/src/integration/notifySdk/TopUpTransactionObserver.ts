import {NotifySdk} from './NotifySdk';
import {CurrencyValue, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {State} from 'reactive-properties';
import {TransactionData} from 'bnc-sdk/dist/types/src/interfaces';

export interface TopUpTransaction {
  transactionHash: string
  value: CurrencyValue
}

export class TopUpTransactionObserver {
  constructor(
    notifySdk: NotifySdk,
    private readonly address: string,
  ) {
    this.transactions = new State([]);
    const transactionObserver = notifySdk.watchAccount(address);
    transactionObserver.onPool(data => this.handleEvent(data));
    transactionObserver.onSent(data => this.handleEvent(data));
    transactionObserver.onConfirmed(data => this.handleEvent(data));

  }

  private handleEvent(data: TransactionData) {
    const transaction = tryExtractTopUpTransaction(data, this.address);
    if (transaction) {
      this.addTransaction(transaction);
    }
  }

  private addTransaction(transaction: TopUpTransaction) {
    if (this.transactions.get().every(tx => tx.transactionHash !== transaction.transactionHash)) {
      this.transactions.set([...this.transactions.get(), transaction]);
    }
  }

  readonly transactions: State<TopUpTransaction[]>;
}

export function tryExtractTopUpTransaction(data: TransactionData, receiver: string): TopUpTransaction | undefined {
  if (data.asset === 'ETH' && data.to?.toLowerCase() === receiver.toLowerCase()) {
    const value = CurrencyValue.fromWei(data.value as string, ETHER_NATIVE_TOKEN.address);
    if (value.isZero()) {
      return undefined;
    } else {
      return {
        transactionHash: data.hash,
        value,
      };
    }
  } else if (
    data.contractCall !== undefined &&
    data.contractCall.contractType === 'erc20' &&
    data.contractCall.methodName === 'transfer' &&
    (data.contractCall.params as any)['_to'].toLowerCase() === receiver.toLowerCase()
  ) {
    const value = CurrencyValue.fromWei((data.contractCall.params as any)['_value'], data.contractCall.contractAddress);
    if (value.isZero()) {
      return undefined;
    } else {
      return {
        transactionHash: data.hash,
        value,
      };
    }
  } else {
    return undefined;
  }
}
