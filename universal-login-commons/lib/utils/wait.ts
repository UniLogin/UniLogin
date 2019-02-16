import {providers} from 'ethers';
import {Predicate} from './types';

const sleep = (ms : number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitToBeMined = async (provider : providers.Provider, transactionHash : string, tick = 1000) => {
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt || !receipt.blockNumber) {
    await sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return receipt;
};

const waitUntil = async (predicate : Predicate, tick = 5, timeout = 1000, args = []) => {
  let elapsed = 0;
  while (!await predicate(...args)) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }
    await sleep(tick);
    elapsed += tick;
  }
  return true;
};

export {sleep, waitToBeMined, waitUntil};
