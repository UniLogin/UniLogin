import {utils, Contract} from 'ethers';
import PublicResolver from '../build/PublicResolver.json';

const messageSignature = (wallet, to, from, value, data, nonce, gasToken, gasPrice, gasLimit) =>
  wallet.signMessage(
    getMessageArrayify({to, from, value, data, nonce, gasToken, gasPrice, gasLimit})
   );

const getMessageArrayify = (message) =>  utils.arrayify(utils.solidityKeccak256(
  ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
  [message.to, message.from, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasLimit]));

const messageSignatureForApprovals = (wallet, id) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['uint256'],
      [id]),
    ));

const lookupAddress = async (provider, address, resolverAddress) => {
  const node = utils.namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
  const contract = new Contract(resolverAddress, PublicResolver.abi, provider);
  return contract.name(node);
};

const getExecutionArgs = (msg) =>
  [msg.to, msg.value, msg.data, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType];

export {messageSignature, messageSignatureForApprovals, lookupAddress, getExecutionArgs};
