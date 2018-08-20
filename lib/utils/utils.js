import ethers, {utils} from 'ethers';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

const waitForContractDeploy = async (provider, contractJSON, tansactionHash) => {
  const abi = contractJSON.interface;
  await provider.waitForTransaction(tansactionHash);
  const receipt = await provider.getTransactionReceipt(tansactionHash);
  return new ethers.Contract(receipt.contractAddress, abi, provider);
};

export {addressToBytes32, waitForContractDeploy};
