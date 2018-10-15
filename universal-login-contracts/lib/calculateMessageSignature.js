import {utils, Wallet} from 'ethers';

const callPrefix = '0xc435c72c';
const operationType = 0;
const extraHash = utils.solidityKeccak256(['bytes32'], ['0x0000000000000000000000000000000000000000000000000000000000000000']);

const calculateMessageSignature = (privateKey, msg) => {
  const wallet = new Wallet(privateKey);
  const dataHash = utils.solidityKeccak256(['bytes'], [msg.data]);
  const massageHash = utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes32', 'uint256', 'uint', 'uint', 'address', 'uint', 'bytes32'],
    [msg.from, msg.to, msg.value, dataHash, msg.nonce, msg.gasPrice, msg.gasLimit, msg.gasToken, operationType, extraHash]);
  return wallet.signMessage(utils.arrayify(massageHash));
};

export default calculateMessageSignature;
