import {utils, Wallet} from 'ethers';

export interface Message {
  from: string;
  to: string;
  value: utils.BigNumberish;
  data: string;
  nonce: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  gasToken: string;
  gasLimit: utils.BigNumberish;
  operationType: utils.BigNumberish;
}

export const calculateMessageHash = (msg: Message) => {
  const dataHash = utils.solidityKeccak256(['bytes'], [msg.data]);
  return utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes32', 'uint256', 'uint', 'address', 'uint', 'uint'],
    [msg.from, msg.to, msg.value, dataHash, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType]);
};

export const calculateMessageSignature = async (privateKey: string, msg: Message) => {
  const wallet = new Wallet(privateKey);
  const massageHash = calculateMessageHash(msg);
  return wallet.signMessage(utils.arrayify(massageHash));
};

const removePrefix = (value: string, index: number, array: string[])  => {
  const signature = value;
  if (value.length !== 132) {
    throw `Invalid signature length: ${signature} should be 132`;
  }
  if (value.indexOf('0x') !== 0) {
    throw `Invalid Signature: ${signature} needs prefix 0x`;
  }
  return signature.slice(2);
};

export const concatenateSignatures = (signatures: string[])  => {
  return `0x${signatures.map(removePrefix).join('')}`;
};