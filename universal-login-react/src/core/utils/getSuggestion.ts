import {Suggestion, SuggestionItem} from '../models/Suggestion';
import {WalletSuggestionAction, Suggestions} from '@unilogin/commons';
import {filterENSNames} from '../../app/filterENSNames';

export const getSuggestion = (
  suggestions: Suggestions,
  actions: WalletSuggestionAction[],
  source: string,
): Suggestion => {
  const filteredCreations = actions.includes(WalletSuggestionAction.create) ? filterENSNames(suggestions.creations) : [];
  const filteredConnections = actions.includes(WalletSuggestionAction.connect) ? suggestions.connections : [];

  if (source.length > 0 && source.length < 3) {
    return {kind: 'KeepTyping'};
  } else if (isTakenOrInvalid(actions, filteredCreations, source)) {
    return {kind: 'TakenOrInvalid'};
  } else if (isInvalidForSuggestion(actions, filteredConnections, source)) {
    return {kind: 'InvalidForConnection'};
  } else if (isNone(filteredCreations, filteredConnections, source)) {
    return {kind: 'None'};
  } else if (isSingleCreation(filteredCreations, filteredConnections)) {
    return {kind: 'Creation', name: filteredCreations[0]};
  } else if (isSingleConnection(filteredCreations, filteredConnections)) {
    return {kind: 'Connection', name: filteredConnections[0]};
  } else {
    return {
      kind: 'Available',
      suggestions: [
        ...filteredCreations.map<SuggestionItem>(name => ({kind: 'Creation', name})),
        ...filteredConnections.map<SuggestionItem>(name => ({kind: 'Connection', name})),
      ],
    };
  }
};

const isSingleCreation = (creations: string[], connections: string[]) =>
  creations.length === 1 && connections.length === 0;

const isSingleConnection = (creations: string[], connections: string[]) =>
  creations.length === 0 && connections.length === 1;

const isNone = (creations: string[], connections: string[], source: string) =>
  source.length === 0 || (creations.length === 0 && connections.length === 0);

const isTakenOrInvalid = (actions: WalletSuggestionAction[], creations: string[], source: string) => {
  const isOnlyCreateAction =
    actions.includes(WalletSuggestionAction.create) && actions.length === 1;
  return creations.length === 0 && isOnlyCreateAction && source.length > 0;
};

const isInvalidForSuggestion = (actions: WalletSuggestionAction[], connections: string[], source: string) => {
  const isOnlyConnectAction =
    actions.includes(WalletSuggestionAction.connect) && !actions.includes(WalletSuggestionAction.create) && actions.length === 1;
  return isOnlyConnectAction && connections.length === 0 && source.length > 0;
};
