import {utils, Contract} from 'ethers';
import {sleep} from 'universal-login-contracts';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

const waitForContractDeploy = async (providerOrWallet, contractJSON, transactionHash) => {
  const {abi} = contractJSON;
  const receipt = await waitForTransactionReceipt(providerOrWallet, transactionHash);
  return new Contract(receipt.contractAddress, abi, providerOrWallet);
};

const waitForTransactionReceipt = async (providerOrWallet, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  let receipt = await provider.getTransactionReceipt(transactionHash);
  do {
    receipt = await provider.getTransactionReceipt(transactionHash);
    await sleep(tick);
  } while (!receipt || !receipt.blockHash);
  return receipt;
};

const getKeyFromData = (data) =>
  data.substr(0, 2) + data.substr(26, 67);

export {waitForContractDeploy, addressToBytes32, waitForTransactionReceipt, getKeyFromData};
