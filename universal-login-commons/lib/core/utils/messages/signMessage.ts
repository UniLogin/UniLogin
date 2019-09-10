import {utils} from 'ethers';
import {DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE} from '../../constants/constants';
import {MessageWithFrom, UnsignedMessage, CollectedSignatureKeyPair, SignedMessage} from '../../models/message';
import {calculateMessageSignature, concatenateSignatures} from './calculateMessageSignature';
import { sortSignatureKeyPairsByKey } from '../signatures';


const emptyMessage = {
  to: '',
  value: utils.parseEther('0.0'),
  data: utils.formatBytes32String('0'),
  nonce: 0,
  gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE),
  gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
  gasData: utils.bigNumberify(0),
  gasToken: '0x0000000000000000000000000000000000000000'
};


export const createSignedMessage = (override: MessageWithFrom, privateKey: string) => {
  const message: UnsignedMessage = {...emptyMessage, ...override};
  const signature = calculateMessageSignature(privateKey, message);
  return {...message, signature};
};

export const getMessageWithSignatures = async (message: UnsignedMessage, collectedSignatureKeyPairs: CollectedSignatureKeyPair[]) : Promise<SignedMessage> => {
  const sortedSignatureKeyPairs = sortSignatureKeyPairsByKey([...collectedSignatureKeyPairs]);
  const sortedSignatures = sortedSignatureKeyPairs.map((value: CollectedSignatureKeyPair) => value.signature);
  const signature = concatenateSignatures(sortedSignatures);
  return  { ...message, signature};
};
