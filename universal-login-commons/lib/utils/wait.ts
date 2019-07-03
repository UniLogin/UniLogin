import {providers, Contract, Wallet} from 'ethers';
import {Predicate} from '../core/types/common';
import Assertion = Chai.Assertion;
import { ContractJSON } from '../core/types/ContractJSON';

export const sleep = (ms : number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waitToBeMined = (provider : providers.Provider, transactionHash : string, tick = 1000) =>
  provider.waitForTransaction(transactionHash);


export const waitUntil = async (predicate : Predicate, tick: number = 5, timeout: number = 1000, args: any[] = []) => {
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

export async function waitExpect(callback: () => void | Promise<void> | Assertion, timeout: number = 1000, tick: number = 5) {
  let elapsed = 0;
  let lastError;
  while (elapsed < timeout) {
    try {
      await callback();
      return;
    } catch (e) {
      await sleep(tick);
      elapsed += tick;
      lastError = e;
    }
  }
  throw lastError;
}

const isWallet = (maybeWallet: any) : boolean  => {
  return maybeWallet.constructor.name === 'Wallet';
};

export const waitForContractDeploy = async (providerOrWallet : providers.Provider | Wallet, contractJSON : ContractJSON, transactionHash : string) => {
  const provider : providers.Provider = (isWallet(providerOrWallet)) ? (<Wallet>providerOrWallet).provider : <providers.Provider>providerOrWallet;
  const receipt = await provider.waitForTransaction(transactionHash);
  return new Contract(<string>receipt.contractAddress, contractJSON.abi, providerOrWallet);
};

export const sendAndWaitForTransaction = async (deployer : Wallet, transaction : providers.TransactionRequest) => {
  const tx = await deployer.sendTransaction(transaction);
  const receipt = await deployer.provider.waitForTransaction(tx.hash!);
  return receipt.contractAddress;
};
