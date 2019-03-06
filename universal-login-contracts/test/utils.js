import {providers, utils, Contract} from 'ethers';
import PublicResolver from '../build/PublicResolver';

const messageSignature = (wallet, to, from, value, data, nonce, gasToken, gasPrice, gasLimit) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
      [to, from, value, data, nonce, gasToken, gasPrice, gasLimit]),
    ));

const messageSignatureForApprovals = (wallet, id) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['uint256'],
      [id]),
    ));

const withENS = (provider, ensAddress) => {
  const chainOptions = {ensAddress, chainId: 0};
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

const lookupAddress = async (provider, address, resolverAddress) => {
  const node = utils.namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
  const contract = new Contract(resolverAddress, PublicResolver.abi, provider);
  return contract.name(node);
};

const getExecutionArgs = (msg) =>
  [msg.to, msg.value, msg.data, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType];

const walletComparator = (wallet1, wallet2) =>  {
  const address1 = parseInt(wallet1.address, 16);
  const address2 = parseInt(wallet2.address, 16);
  if (address1 > address2) {
    return 1;
  } else if (address1 < address2) {
    return -1;
  } else {
    return 0;
  }
};

const sortWallets = (wallets) =>
  wallets.sort(walletComparator);

export {messageSignature, messageSignatureForApprovals, withENS, lookupAddress, getExecutionArgs, sortWallets};
