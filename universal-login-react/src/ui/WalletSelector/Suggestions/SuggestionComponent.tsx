import React, {useState} from 'react';
import {ensureNotFalsy, WalletSuggestionAction} from '@unilogin/commons';
import {KeepTypingSuggestion} from './KeepTypingSuggestion';
import {MissingParameter} from '../../../core/utils/errors';
import {TakenOrInvalidSuggestion} from './TakenOrInvalidSuggestion';
import {InvalidForConnectionSuggestion} from './InvalidForConnectionSuggestion';
import {Suggestion} from '../../../core/models/Suggestion';
import {classForComponent} from '../../utils/classFor';
import {SuggestionGroupMultiple, SuggestionGroupSingle} from './SuggestionGroup';

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
        <div className={classForComponent('suggestions-wrapper')}>
          <SuggestionGroupSingle
            hint='This username is available'
            label='Already have an account?'
            operationType='connect'
            onClick={handleConnectClick}
            suggestion={suggestion.name}
            selectedSuggestion={selectedSuggestion}
          />
        </div>
      );
    case 'Creation':
      return (
        <div className={classForComponent('suggestions-wrapper')}>
          <SuggestionGroupSingle
            hint='This username is available'
            label='New user?'
            operationType='create new'
            onClick={handleCreateClick}
            suggestion={suggestion.name}
            selectedSuggestion={selectedSuggestion}
          />
        </div>
      );
    case 'Available':
      const createSuggestions = suggestion.suggestions.filter(element => element.kind === 'Creation');
      const connectSuggestions = suggestion.suggestions.filter(element => element.kind === 'Connection');
      return (
        <div className={classForComponent('suggestions-wrapper')}>
          {createSuggestions.length !== 0 &&
            <SuggestionGroupMultiple
              suggestions={createSuggestions}
              label='New user?'
              selectedSuggestion={selectedSuggestion}
              operationType='create new'
              onClick={handleCreateClick}
            />
          }
          {connectSuggestions.length !== 0 &&
            <SuggestionGroupMultiple
              suggestions={connectSuggestions}
              label='Already have an account?'
              selectedSuggestion={selectedSuggestion}
              operationType='connect'
              onClick={handleConnectClick}
            />
          }
        </div>
      );
  }
};

export default SuggestionComponent;
