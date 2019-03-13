import {providers, Contract, Wallet} from 'ethers';
import {Predicate} from './types';

const sleep = (ms : number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitToBeMined = (provider : providers.Provider, transactionHash : string, tick = 1000) =>
  provider.waitForTransaction(transactionHash);


const waitUntil = async (predicate : Predicate, tick: number = 5, timeout: number = 1000, args: any[] = []) => {
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

interface ContractJSON {
  abi: any;
  evm: {bytecode: {object: any}};
}

const isWallet = (maybeWallet: any) : boolean  => {
  return maybeWallet.constructor.name === 'Wallet';
};

const waitForContractDeploy = async (providerOrWallet : providers.Provider | Wallet, contractJSON : ContractJSON, transactionHash : string) => {
  const provider : providers.Provider = (isWallet(providerOrWallet)) ? (<Wallet>providerOrWallet).provider : <providers.Provider>providerOrWallet;
  const receipt = await provider.waitForTransaction(transactionHash);
  return new Contract(<string>receipt.contractAddress, contractJSON.abi, providerOrWallet);
};

export {sleep, waitToBeMined, waitUntil, waitForContractDeploy};
