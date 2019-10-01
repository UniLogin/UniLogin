
import {UnsignedMessage, CollectedSignatureKeyPair, SignedMessage} from '../../models/message';
import {concatenateSignatures} from './calculateMessageSignature';
import {sortSignatureKeyPairsByKey} from '../signatures';

export const getMessageWithSignatures = async (message: UnsignedMessage, collectedSignatureKeyPairs: CollectedSignatureKeyPair[]) : Promise<SignedMessage> => {
  const sortedSignatureKeyPairs = sortSignatureKeyPairsByKey([...collectedSignatureKeyPairs]);
  const sortedSignatures = sortedSignatureKeyPairs.map((value: CollectedSignatureKeyPair) => value.signature);
  const signature = concatenateSignatures(sortedSignatures);
  return  { ...message, signature};
};
