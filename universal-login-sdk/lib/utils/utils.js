import {utils, Contract} from 'ethers';
import {sleep} from 'universal-login-commons';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

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

const getKeyFromData = (data) =>
  data.substr(0, 2) + data.substr(26, 67);

export {waitForContractDeploy, addressToBytes32, waitForTransactionReceipt, getKeyFromData};
