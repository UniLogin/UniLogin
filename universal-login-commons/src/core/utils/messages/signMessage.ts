
import {CollectedSignatureKeyPair} from '../../models/message';
import {concatenateSignatures} from './calculateMessageSignature';
import {sortSignatureKeyPairsByKey} from '../signatures';

export const getSignatureFrom = async (collectedSignatureKeyPairs: CollectedSignatureKeyPair[]): Promise<string> => {
  const sortedSignatureKeyPairs = sortSignatureKeyPairsByKey([...collectedSignatureKeyPairs]);
  const sortedSignatures = sortedSignatureKeyPairs.map((value: CollectedSignatureKeyPair) => value.signature);
  return concatenateSignatures(sortedSignatures);
};
