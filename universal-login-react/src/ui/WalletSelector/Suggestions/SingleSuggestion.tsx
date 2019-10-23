import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SingleSuggestionProps} from '../../../core/models/SuggestionProps';

export const SingleSuggestion = ({onClick, operationType, suggestion, hint}: SingleSuggestionProps) => (
  <>
    <p className="suggestions-ens-name">{suggestion}</p>
    <p className="suggestions-hint">{hint}</p>
    <button className="single-suggestion-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
      {operationType}
    </button>
  </>
);
