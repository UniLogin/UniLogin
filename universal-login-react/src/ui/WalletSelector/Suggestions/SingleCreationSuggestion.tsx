import React from 'react';
import {getSuggestionId} from '@universal-login/commons';

interface SingleCreationSuggestionProps {
  suggestion: string;
  operationType: string;
  onClick(suggestion: string): Promise<void>;
}

export const SingleCreationSuggestion = ({onClick, operationType, suggestion}: SingleCreationSuggestionProps) => (
  <>
    <p className="suggestions-ens-name">{suggestion}</p>
    <p className="suggestions-hint"> This username is available </p>
    <button className="suggestions-create-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
      Create New Account
    </button>
  </>
);
