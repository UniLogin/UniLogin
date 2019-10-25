import {SuggestionType} from '../models/SuggestionType';
import {WalletSuggestionAction} from '@universal-login/commons';

export const getSuggestionType = (
  creations: string[],
  connections: string[],
  actions: WalletSuggestionAction[],
  source: string,
): SuggestionType => {
  if (0 < source.length && source.length < 3) {
    return 'KeepTyping';
  } else if (isNone(creations, connections, source)) {
    return 'None';
  } else if (isSingleCreation(creations, connections)) {
    return 'SingleCreation';
  } else if (isSingleConnection(creations, connections, actions)) {
    return 'SingleConnection';
  } else {
    return 'Multiple';
  }
};

const isSingleCreation = (creations: string[], connections: string[]) =>
  creations.length === 1 && connections.length === 0;

const isSingleConnection = (creations: string[], connections: string[], actions: WalletSuggestionAction[]) =>
  !actions.includes(WalletSuggestionAction.recover) && creations.length === 0 && connections.length === 1;

const isNone = (creations: string[], connections: string[], source: string) =>
  source.length === 0 || (creations.length === 0 && connections.length === 0);
