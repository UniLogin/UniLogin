import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SuggestionProps} from '../../../core/models/SuggestionProps';

export const MultipleSuggestion = ({onClick, operationType, suggestion}: SuggestionProps) => (
  <button className="suggestions-item-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
    <p className="suggestions-item-text">{suggestion}</p>
    <p className="suggestions-item-btn-text">{operationType}</p>
  </button>
);
