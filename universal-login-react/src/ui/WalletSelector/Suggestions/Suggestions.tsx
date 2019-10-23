import React from 'react';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS} from '@universal-login/commons';
import {getSuggestionType} from '../../../core/utils/getSuggestionType';
import {SuggestionType} from '../../../core/models/SuggestionType';
import {Suggestion} from './Suggestion';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
  onCreateClick(ensName: string): Promise<void> | void;
  onConnectClick(ensName: string): Promise<void> | void;
  actions: WalletSuggestionAction[];
}

const getSuggestionsItems = (operationType: string, array: string[], onClick: (ensName: string) => Promise<void> | void, suggestionType?: SuggestionType) =>
  array.map(element => (
    <li
      key={`${operationType}_${element}`}
      className="suggestions-item"
    >
      <Suggestion
        suggestion={element}
        operationType={operationType}
        type={suggestionType}
        onClick={onClick}
      />
    </li>
  ));

const getSuggestions = (suggestions: string[], actions: WalletSuggestionAction[] = WALLET_SUGGESTION_ALL_ACTIONS, flag: WalletSuggestionAction): string[] =>
  actions.includes(flag) ? suggestions : [];

export const Suggestions = ({connections, creations, onCreateClick, onConnectClick, actions}: SuggestionsProps) => {
  const suggestionType = getSuggestionType(creations, connections, actions);
  const connectionsSuggestions = getSuggestionsItems('connect to existing', getSuggestions(connections, actions, WalletSuggestionAction.connect), onConnectClick, suggestionType);
  const creationsSuggestions = getSuggestionsItems('create new', getSuggestions(creations, actions, WalletSuggestionAction.create), onCreateClick, suggestionType);
  const recoversSuggestions = getSuggestionsItems('recover', getSuggestions(connections, actions, WalletSuggestionAction.recover), async () => alert('not implemented'));
  return (
    <ul className="suggestions-list">
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
