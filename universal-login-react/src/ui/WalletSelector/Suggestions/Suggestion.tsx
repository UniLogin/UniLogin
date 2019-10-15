import React from 'react';
import {SuggestionType} from '../../../core/models/SuggestionType';
import {getSuggestionId} from '@universal-login/commons';

interface SuggestionProps {
  type?: SuggestionType;
  suggestion: string;
  operationType: string;
  onClick(suggestion: string): Promise<void>;
}

export const Suggestion = ({onClick, suggestion, operationType, type}: SuggestionProps) => {
  switch (type) {
    case 'SingleCreation':
      return (
        <>
          <p className="suggestions-ens-name">{suggestion}</p>
          <p className="suggestions-hint"> This username is available </p>
          <button className="suggestions-create-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
            Create New Account
            </button>
        </>
      );
    case 'Multiple':
    default:
      return (
        <button className="suggestions-item-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
          <p className="suggestions-item-text">{suggestion}</p>
          <p className="suggestions-item-btn-text">{operationType}</p>
        </button>
      );
  }
};
