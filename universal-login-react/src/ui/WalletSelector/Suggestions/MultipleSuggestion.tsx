import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SuggestionProps} from '../../../core/models/SuggestionProps';
import {EnsName} from '../../commons/EnsName';
import {Spinner} from '../../commons/Spinner';

export const MultipleSuggestion = ({onClick, operationType, suggestion, selectedSuggestion}: SuggestionProps) => (
  <button disabled={!!selectedSuggestion} className="suggestions-item-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
    <div className="suggestions-item-text">
      <EnsName value={suggestion} />
    </div>
    {suggestion !== selectedSuggestion
      ? <p className="suggestions-item-btn-text">{operationType}</p>
      : <Spinner className='spinner-small-center' />}
  </button>
);
