import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SuggestionProps} from '../../../core/models/SuggestionProps';
import {EnsName} from '../../commons/EnsName';

export const MultipleSuggestion = ({onClick, operationType, suggestion}: SuggestionProps) => (
  <button className="suggestions-item-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
    <div className="suggestions-item-text"><EnsName value={suggestion} /></div>
    <p className="suggestions-item-btn-text">{operationType}</p>
  </button>
);
