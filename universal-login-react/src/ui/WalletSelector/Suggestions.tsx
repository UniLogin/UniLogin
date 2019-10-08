import React from 'react';
import {getSuggestionId, WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS} from '@universal-login/commons';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
  onCreateClick: (...args: any[]) => void;
  onConnectClick: (...args: any[]) => void;
  actions?: WalletSuggestionAction[];
}

const getButton = (operationType: string, suggestion: string, onClick: (...args: any[]) => void, isSingleCreation?: boolean) => {
  if (isSingleCreation) {
    return (
      <>
        <h3 className="suggestions-title">{suggestion}</h3>
        <span className="suggestion-element"> This username is available </span>
        <button className="suggestions-item-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
          Create New Account
        </button>
      </>
    );
  } else {
    return (
      <button className="suggestions-item-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
        <p className="suggestions-item-text">{suggestion}</p>
        <p className="suggestions-item-btn-text">{operationType}</p>
      </button>
    );
  }
};

const getSuggestionsItems = (operationType: string, array: string[], onClick: (...args: any[]) => void, isSingleCreation?: boolean) =>
  array.map((element => (
    <li
      key={`${operationType}_${element}`}
      className="suggestions-item"
    >
      {getButton(operationType, element, onClick, isSingleCreation)}
    </li>
  )));

const getSuggestions = (suggestions: string[], actions: WalletSuggestionAction[] = WALLET_SUGGESTION_ALL_ACTIONS, flag: WalletSuggestionAction): string[] =>
  actions.includes(flag) ? suggestions : [];

export const Suggestions = ({connections, creations, onCreateClick, onConnectClick, actions}: SuggestionsProps) => {
  const isSingleCreation = connections.length === 0 && creations.length === 1;
  const connectionsSuggestions = getSuggestionsItems('connect to existing', getSuggestions(connections, actions, WalletSuggestionAction.connect), onConnectClick);
  const creationsSuggestions = getSuggestionsItems('create new', getSuggestions(creations, actions, WalletSuggestionAction.create), onCreateClick, isSingleCreation);
  const recoversSuggestions = getSuggestionsItems('recover', getSuggestions(connections, actions, WalletSuggestionAction.recover), () => alert('not implemented'));
  return (
    <ul className="suggestions-list">
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
