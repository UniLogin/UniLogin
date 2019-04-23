import {utils} from 'ethers';

export function parseTransactionParametersToString(transaction: Partial<utils.Transaction>) {
  return {
    ...transaction,
    value: transaction.value && transaction.value.toString(),
    gasLimit: transaction.gasLimit && transaction.gasLimit.toString(),
    gasPrice: transaction.gasPrice && transaction.gasPrice.toString()
  };
}

export function parseTransactionParametersToBigNumber(transaction: any) {
  return {
    ...transaction,
    value:  utils.bigNumberify(transaction.value),
    gasLimit: utils.bigNumberify(transaction.gasLimit),
    gasPrice:  utils.bigNumberify(transaction.gasPrice)
  };
}