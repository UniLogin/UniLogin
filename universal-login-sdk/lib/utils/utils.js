import ethers, {utils} from 'ethers';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitForContractDeploy = async (providerOrWallet, contractJSON, transactionHash) => {
  const abi = contractJSON.interface;
  const receipt = await waitForTransactionReceipt(providerOrWallet, transactionHash);
  return new ethers.Contract(receipt.contractAddress, abi, providerOrWallet);
};

const waitForTransactionReceipt = async (providerOrWallet, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt) {
    sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return receipt;
};

const messageSignature = (wallet, to, amount, data) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['address', 'uint256', 'bytes'],
      [to, amount, data])
    ));

export {waitForContractDeploy, messageSignature, addressToBytes32, sleep, waitForTransactionReceipt};
