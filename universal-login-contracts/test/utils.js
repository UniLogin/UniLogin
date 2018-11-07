import ethers, {providers, utils} from 'ethers';
import PublicResolver from '../build/PublicResolver';

const {namehash} = utils;


const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

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

const messageSignature = (wallet, to, from, value, data, nonce, gasToken, gasPrice, gasLimit) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
      [to, from, value, data, nonce, gasToken, gasPrice, gasLimit])
    ));

const messageSignatureForApprovals = (wallet, id) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['uint256'],
      [id])
    ));

const withENS = (provider, ensAddress) => {
  const chainOptions = {ensAddress, chainId: 0};
  // eslint-disable-next-line no-underscore-dangle
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

const lookupAddress = async (provider, address, resolverAddress) => {
  const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
  const contract = new ethers.Contract(resolverAddress, PublicResolver.interface, provider);
  return await contract.name(node);
};

const getExecutionArgs = (msg) =>
  [msg.to, msg.value, msg.data, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType];

export {addressToBytes32, waitForContractDeploy, messageSignature, messageSignatureForApprovals, withENS, lookupAddress, getExecutionArgs};
