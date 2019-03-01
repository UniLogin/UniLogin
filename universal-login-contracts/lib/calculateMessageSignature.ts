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
  return await wallet.signMessage(utils.arrayify(massageHash));
};

export const concatenateBytes = (bytes1: string, bytes2: string) => {
  return bytes1 + bytes2.replace('0x', "");
}
