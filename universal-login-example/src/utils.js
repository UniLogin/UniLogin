import ethers from 'ethers';

const waitForContractDeploy = async (providerOrWallet, contractJSON, tansactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  const abi = contractJSON.interface;
  let receipt = await provider.getTransactionReceipt(tansactionHash);
  while (!receipt) {
    sleep(tick);
    receipt = await provider.getTransactionReceipt(tansactionHash);
  }
  return new ethers.Contract(receipt.contractAddress, abi, providerOrWallet);
};

export {waitForContractDeploy};
