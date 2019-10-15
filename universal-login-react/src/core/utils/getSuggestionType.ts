import {SuggestionType} from '../models/SuggestionType';

export const getSuggestionType = (
  creations: string[],
  connections: string[],
): SuggestionType => {
  if (isSingleCreation(creations, connections)) {
    return 'SingleCreation';
  } else if (isSingleConnection(creations, connections)) {
    return 'SingleConnection';
  } else if (isKeepTyping(creations, connections)) {
    return 'KeepTyping';
  } else {
    return 'Multiple';
  }
};

const isSingleCreation = (creations: string[], connections: string[]) =>
  creations.length === 1 && connections.length === 0;

const isSingleConnection = (creations: string[], connections: string[]) =>
  creations.length === 0 && connections.length === 1;

const isKeepTyping = (creations: string[], connections: string[]) =>
  creations.length === 0 && connections.length === 0;
