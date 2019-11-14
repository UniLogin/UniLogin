import {SuggestionType, SuggestionItem} from '../models/SuggestionType';
import {WalletSuggestionAction} from '@universal-login/commons';

export const getSuggestionType = (
  creations: string[],
  connections: string[],
  actions: WalletSuggestionAction[],
  source: string,
): SuggestionType => {
  if (source.length > 0 && source.length < 3) {
    return {kind: 'KeepTyping'};
  } else if (isNone(creations, connections, source)) {
    return {kind: 'None'};
  } else if (isSingleCreation(creations, connections)) {
    return {kind: 'Creation', name: creations[0]};
  } else if (isSingleConnection(creations, connections, actions)) {
    return {kind: 'Connection', name: connections[0]};
  } else {
    return {kind: 'Available',
      suggestions: [
        ...creations.map<SuggestionItem>(name => ({kind: 'Creation', name})),
        ...connections.map<SuggestionItem>(name => ({kind: 'Connection', name})),
      ]};
  }
};

const isSingleCreation = (creations: string[], connections: string[]) =>
  creations.length === 1 && connections.length === 0;

const isSingleConnection = (creations: string[], connections: string[], actions: WalletSuggestionAction[]) =>
  creations.length === 0 && connections.length === 1;

const isNone = (creations: string[], connections: string[], source: string) =>
  source.length === 0 || (creations.length === 0 && connections.length === 0);
