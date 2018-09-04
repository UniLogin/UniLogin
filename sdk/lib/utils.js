import ethers, {utils} from 'ethers';

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

const messageSignature = (wallet, to, amount, data) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['address', 'uint256', 'bytes'],
      [to, amount, data])
    ));

export {waitForContractDeploy, messageSignature};
