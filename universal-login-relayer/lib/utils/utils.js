import ethers, {providers, utils} from 'ethers';
import ENS from 'universal-login-contracts/build/ENS';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';

const {namehash} = utils;


const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

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

const lookupAddress = async (provider, address) => {
  const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
  const ens = new ethers.Contract(provider.ensAddress, ENS.interface, provider);
  const resolver = await ens.resolver(node);
  const contract = new ethers.Contract(resolver, PublicResolver.interface, provider);
  return await contract.name(node);
};

export {addressToBytes32, waitForContractDeploy, messageSignature, messageSignatureForApprovals, withENS, lookupAddress};
