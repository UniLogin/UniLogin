import {Contract} from 'ethers';

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitForContractDeploy = async (providerOrWallet, contractJSON, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  const abi = contractJSON.interface;
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt) {
    sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return new Contract(receipt.contractAddress, abi, providerOrWallet);
};

const waitToBeMined = async (providerOrWallet, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt || !receipt.blockNumber) {
    sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
};

export {waitForContractDeploy, waitToBeMined};
