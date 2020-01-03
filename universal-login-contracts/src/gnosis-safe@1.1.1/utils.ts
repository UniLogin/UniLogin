import {utils} from 'ethers';
import {getDeployData, SignedMessage} from '@universal-login/commons';
import ProxyContract from './contracts/Proxy.json';

export const computeGnosisCounterfactualAddress = (proxyFactoryAddress: string, saltNonce: number, initializeData: string, gnosisSafeAddress: string) => {
  const deployData = getDeployData(ProxyContract, [gnosisSafeAddress]);
  const initCodeHash = utils.solidityKeccak256(['bytes'], [deployData]);
  const dataCallHash = utils.solidityKeccak256(['bytes'], [initializeData]);
  const finalSalt = utils.solidityKeccak256(['bytes32', 'uint256'], [dataCallHash, saltNonce]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', proxyFactoryAddress, finalSalt, initCodeHash]);
  return utils.getAddress(`0x${hashedData.slice(26)}`);
};

const DOMAIN_SEPARATOR_TYPEHASH = '0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749';
const SAFE_TX_TYPEHASH = '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8';

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
