import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SingleSuggestionProps} from '../../../core/models/SuggestionProps';
import {EnsName} from '../../commons/EnsName';

export const SingleSuggestion = ({onClick, operationType, suggestion, hint}: SingleSuggestionProps) => (
  <>
    <div className="suggestions-ens-name"><EnsName value={suggestion} /></div>
    <p className="suggestions-hint">{hint}</p>
    <button className="single-suggestion-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
      {operationType}
    </button>
  </>
);
