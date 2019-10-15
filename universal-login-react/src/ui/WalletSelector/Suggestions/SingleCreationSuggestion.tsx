import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SuggestionProps} from '../../../core/models/SuggestionProps';

export const SingleCreationSuggestion = ({onClick, operationType, suggestion}: SuggestionProps) => (
  <>
    <p className="suggestions-ens-name">{suggestion}</p>
    <p className="suggestions-hint"> This username is available </p>
    <button className="suggestions-create-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
      Create New Account
    </button>
  </>
);
