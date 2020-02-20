import {utils} from 'ethers';
import {getDeployData, SignedMessage, UnsignedMessage} from '@unilogin/commons';
import ProxyContract from './contracts/Proxy.json';
import {SAFE_TX_TYPEHASH, DOMAIN_SEPARATOR_TYPEHASH, SAFE_MSG_TYPEHASH, SENTINEL_OWNERS} from './constants';

export const computeGnosisCounterfactualAddress = (proxyFactoryAddress: string, saltNonce: number, initializeData: string, gnosisSafeAddress: string) => {
  const deployData = getDeployData(ProxyContract, [gnosisSafeAddress]);
  const initCodeHash = utils.solidityKeccak256(['bytes'], [deployData]);
  const dataCallHash = utils.solidityKeccak256(['bytes'], [initializeData]);
  const finalSalt = utils.solidityKeccak256(['bytes32', 'uint256'], [dataCallHash, saltNonce]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', proxyFactoryAddress, finalSalt, initCodeHash]);
  return utils.getAddress(`0x${hashedData.slice(26)}`);
};

export const calculateMessageHash = (message: Omit<SignedMessage, 'signature'>) => {
  const abiCoder = new utils.AbiCoder();
  const dataHash = utils.solidityKeccak256(['bytes'], [message.data]);
  const safeTxHash = utils.keccak256(abiCoder.encode(
    ['bytes32', 'address', 'uint256', 'bytes32', 'uint8', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint256'],
    [SAFE_TX_TYPEHASH, message.to, message.value, dataHash, message.operationType, message.safeTxGas, message.baseGas, message.gasPrice, message.gasToken, message.refundReceiver, message.nonce],
  ));
  const domainSeparator = utils.keccak256(abiCoder.encode(['bytes32', 'address'], [DOMAIN_SEPARATOR_TYPEHASH, message.from]));
  return utils.solidityKeccak256(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', domainSeparator, safeTxHash]);
};

export const calculateMessageSignature = (unsignedMessage: UnsignedMessage, privateKey: string) => {
  const msgHash = calculateMessageHash(unsignedMessage);
  return signStringMessage(msgHash, privateKey);
};

export const signStringMessage = (payload: string, privateKey: string) => {
  const signingKey = new utils.SigningKey(privateKey);
  const signature = signingKey.signDigest(payload);
  return utils.joinSignature(signature);
};

export const calculateGnosisStringHash = (message: Uint8Array, contractAddress: string) => {
  const abiCoder = new utils.AbiCoder();
  const hashOfMsgBytes = utils.solidityKeccak256(['bytes'], [message]);
  const msgHash = utils.keccak256(abiCoder.encode(['bytes32', 'bytes32'],
    [SAFE_MSG_TYPEHASH, hashOfMsgBytes]));
  const DOMAIN_SEPARATOR_TYPEHASH = '0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749';
  const domainSeparator = utils.keccak256(abiCoder.encode(['bytes32', 'address'], [DOMAIN_SEPARATOR_TYPEHASH, contractAddress]));
  return utils.solidityKeccak256(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', domainSeparator, msgHash]);
};

export const getPreviousOwner = (owners: string[], currentOwner: string) => {
  const currentOwnerIndex = owners.findIndex(owner => currentOwner === owner);
  if (currentOwnerIndex === 0) {
    return SENTINEL_OWNERS;
  } else {
    return owners[currentOwnerIndex - 1];
  }
};

export const isInvalidOwnerError = (error: any) =>
  isInvalidOwnerErrorGanache(error) || isInvalidOwnerErrorMainchain(error);

const isInvalidOwnerErrorGanache = (error: any) =>
  error.message === 'VM Exception while processing transaction: revert Invalid owner provided';

const isInvalidOwnerErrorMainchain = (error: any) =>
  error.reason[0] === 'Invalid owner provided' && error.reason.length === 1;
