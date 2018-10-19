import {utils, Wallet} from 'ethers';


const calculateMessageHash = (msg) => {
  const dataHash = utils.solidityKeccak256(['bytes'], [msg.data]);
  const extraHash = utils.solidityKeccak256(['bytes'], [msg.extraData]);
  return utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes32', 'uint256', 'uint', 'address', 'uint', 'uint', 'bytes32'],
    [msg.from, msg.to, msg.value, dataHash, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType, extraHash]);
};

const calculateMessageSignature = (privateKey, msg) => {
  const wallet = new Wallet(privateKey);
  const massageHash = calculateMessageHash(msg);
  return wallet.signMessage(utils.arrayify(massageHash));
};

export {calculateMessageHash};

export default calculateMessageSignature;



