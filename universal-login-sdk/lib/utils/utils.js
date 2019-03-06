import {utils, Contract} from 'ethers';
import {sleep} from 'universal-login-commons';

const waitForContractDeploy = async (providerOrWallet, contractJSON, transactionHash) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  const {abi} = contractJSON;
  const receipt = await waitForTransactionReceipt(providerOrWallet, transactionHash);
  return new Contract(receipt.contractAddress, abi, providerOrWallet);
};

const waitForTransactionReceipt = async (providerOrWallet, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  return provider.waitForTransaction(transactionHash);
};


export {waitForContractDeploy, waitForTransactionReceipt};
