import React from 'react';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS, ensureNotNull} from '@universal-login/commons';
import {getSuggestionType} from '../../../core/utils/getSuggestionType';
import {SuggestionType} from '../../../core/models/SuggestionType';
import {KeepTypingSuggestion} from './KeepTypingSuggestion';
import {MissingParameter} from '../../../core/utils/errors';
import {SingleSuggestion} from './SingleSuggestion';
import {MultipleSuggestion} from './MultipleSuggestion';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
  source: string;
  onCreateClick(ensName: string): Promise<void> | void;
  onConnectClick(ensName: string): Promise<void> | void;
  actions: WalletSuggestionAction[];
}

interface SuggestionItemsProps {
  operationType: string;
  array: string[];
  onClick: (ensName: string) => Promise<void> | void;
  suggestionType?: SuggestionType;
}

const SuggestionItems = ({operationType, array, onClick, suggestionType}: SuggestionItemsProps) => (
  <>
    {array.map(element => (
      <li
        key={`${operationType}_${element}`}
        className="suggestions-item"
      >
        <MultipleSuggestion
          suggestion={element}
          operationType={operationType}
          onClick={onClick}
        />
      </li>
    ))}
  </>
);

const getSuggestions = (suggestions: string[], actions: WalletSuggestionAction[] = WALLET_SUGGESTION_ALL_ACTIONS, flag: WalletSuggestionAction): string[] =>
  actions.includes(flag) ? suggestions : [];

export const Suggestions = ({connections, creations, onCreateClick, onConnectClick, actions, source}: SuggestionsProps) => {
  actions.includes(WalletSuggestionAction.connect) && ensureNotNull(onConnectClick, MissingParameter, 'onConnectClick');
  actions.includes(WalletSuggestionAction.create) && ensureNotNull(onCreateClick, MissingParameter, 'onCreateClick');

  const suggestionType = getSuggestionType(creations, connections, actions, source);
  switch (suggestionType.kind) {
    case 'None':
      return null;
    case 'KeepTyping':
      return <KeepTypingSuggestion />;
    case 'Connection':
      return (
        <ul className="suggestions-list">
          <li className="suggestions-item">
            <SingleSuggestion
              hint='Do you want to connect to this account?'
              operationType='connect to existing'
              onClick={onConnectClick}
              suggestion={suggestionType.name}
            />
          </li>
        </ul>
      );
    case 'Creation':
      return (
        <ul className="suggestions-list">
          <li className="suggestions-item">
            <SingleSuggestion
              hint='This username is available'
              operationType='create new'
              onClick={onCreateClick}
              suggestion={suggestionType.name}
            />
          </li>
        </ul>
      );
    case 'Available':
      return (
        <ul className="suggestions-list">
          <SuggestionItems
            operationType='connect to existing'
            array={getSuggestions(connections, actions, WalletSuggestionAction.connect)}
            suggestionType={suggestionType}
            onClick={onConnectClick}
          />
          <SuggestionItems
            operationType='create new'
            array={getSuggestions(creations, actions, WalletSuggestionAction.create)}
            suggestionType={suggestionType}
            onClick={onCreateClick}
          />
        </ul>
      );
  }
};

export default Suggestions;
