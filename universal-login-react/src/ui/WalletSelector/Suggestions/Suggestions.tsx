import React, {useState} from 'react';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS, ensureNotNull} from '@universal-login/commons';
import {getSuggestion} from '../../../core/utils/getSuggestion';
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
  selectedSuggestion: string;
  onClick: (ensName: string) => Promise<void> | void;
}

const SuggestionItems = ({operationType, array, onClick, selectedSuggestion}: SuggestionItemsProps) => (
  <>
    {array.map(element => (
      <li
        key={`${operationType}_${element}`}
        className="suggestions-item"
      >
        <MultipleSuggestion
          suggestion={element}
          selectedSuggestion={selectedSuggestion}
          operationType={operationType}
          onClick={onClick}
        />
      </li>
    ))}
  </>
);

export const Suggestions = ({connections, creations, onCreateClick, onConnectClick, actions, source}: SuggestionsProps) => {
  actions.includes(WalletSuggestionAction.connect) && ensureNotNull(onConnectClick, MissingParameter, 'onConnectClick');
  actions.includes(WalletSuggestionAction.create) && ensureNotNull(onCreateClick, MissingParameter, 'onCreateClick');

  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const handleConnectClick = (ensName: string) => {
    setSelectedSuggestion(ensName);
    onConnectClick(ensName);
  };
  const handleCreateClick = (ensName: string) => {
    setSelectedSuggestion(ensName);
    onCreateClick(ensName);
  };

  const suggestionType = getSuggestion(creations, connections, actions, source);
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
              operationType='connect'
              onClick={handleConnectClick}
              suggestion={suggestionType.name}
              selectedSuggestion={selectedSuggestion}
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
              onClick={handleCreateClick}
              suggestion={suggestionType.name}
              selectedSuggestion={selectedSuggestion}
            />
          </li>
        </ul>
      );
    case 'Available':
      return (
        <ul className="suggestions-list">
          <SuggestionItems
            operationType='connect'
            array={connections}
            selectedSuggestion={selectedSuggestion}
            onClick={handleConnectClick}
          />
          <SuggestionItems
            operationType='create new'
            array={creations}
            selectedSuggestion={selectedSuggestion}
            onClick={handleCreateClick}
          />
        </ul>
      );
  }
};

export default Suggestions;
