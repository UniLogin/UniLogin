import {providers, Contract, Wallet} from 'ethers';
import {ContractJSON} from '../../core/types/ContractJSON';

export const waitToBeMined = (provider : providers.Provider, transactionHash : string, tick = 1000) =>
  provider.waitForTransaction(transactionHash);


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
