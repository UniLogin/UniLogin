import React, {useState} from 'react';
import {ensureNotFalsy, WalletSuggestionAction} from '@universal-login/commons';
import {KeepTypingSuggestion} from './KeepTypingSuggestion';
import {MissingParameter} from '../../../core/utils/errors';
import {SingleSuggestion} from './SingleSuggestion';
import {MultipleSuggestion} from './MultipleSuggestion';
import {TakenOrInvalidSuggestion} from './TakenOrInvalidSuggestion';
import {InvalidForConnectionSuggestion} from './InvalidForConnectionSuggestion';
import {Suggestion} from '../../../core/models/Suggestion';
import {classForComponent} from '../../utils/classFor';

interface SuggestionComponentProps {
  suggestion: Suggestion;
  onCreateClick?(ensName: string): Promise<void> | void;
  onConnectClick?(ensName: string): Promise<void> | void;
  actions: WalletSuggestionAction[];
}

export const SuggestionComponent = ({onCreateClick, onConnectClick, actions, suggestion}: SuggestionComponentProps) => {
  actions.includes(WalletSuggestionAction.connect) && ensureNotFalsy(onConnectClick, MissingParameter, 'onConnectClick');
  actions.includes(WalletSuggestionAction.create) && ensureNotFalsy(onCreateClick, MissingParameter, 'onCreateClick');

  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const handleConnectClick = (ensName: string) => {
    setSelectedSuggestion(ensName);
    onConnectClick!(ensName);
  };
  const handleCreateClick = (ensName: string) => {
    setSelectedSuggestion(ensName);
    onCreateClick!(ensName);
  };

  switch (suggestion.kind) {
    case 'None':
      return null;
    case 'KeepTyping':
      return <KeepTypingSuggestion />;
    case 'TakenOrInvalid':
      return <TakenOrInvalidSuggestion />;
    case 'InvalidForConnection':
      return <InvalidForConnectionSuggestion />;
    case 'Connection':
      return (
        <ul className={classForComponent('suggestions-list')}>
          <li className={classForComponent('suggestions-item')}>
            <SingleSuggestion
              hint='Do you want to connect to this account?'
              operationType='connect'
              onClick={handleConnectClick}
              suggestion={suggestion.name}
              selectedSuggestion={selectedSuggestion}
            />
          </li>
        </ul>
      );
    case 'Creation':
      return (
        <ul className={classForComponent('suggestions-list')}>
          <li className={classForComponent('suggestions-item')}>
            <SingleSuggestion
              hint='This username is available'
              operationType='create new'
              onClick={handleCreateClick}
              suggestion={suggestion.name}
              selectedSuggestion={selectedSuggestion}
            />
          </li>
        </ul>
      );
    case 'Available':
      return (
        <ul className={classForComponent('suggestions-list')}>
          {suggestion.suggestions.map(element => (
            <li key={element.name} className={classForComponent('suggestions-item')}>
              <MultipleSuggestion
                suggestion={element.name}
                selectedSuggestion={selectedSuggestion}
                operationType={element.kind === 'Creation' ? 'create new' : 'connect'}
                onClick={element.kind === 'Creation' ? handleCreateClick : handleConnectClick}
              />
            </li>
          ))}
        </ul>
      );
  }
};

export default SuggestionComponent;
