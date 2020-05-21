import React from 'react';
import {SuggestionProps} from '../../../core/models/SuggestionProps';
import {EnsName} from '../../commons/EnsName';
import {Spinner} from '../../commons/Spinner';
import {classForComponent} from '../../utils/classFor';
import {getSuggestionId} from '../../../app/getSuggestionId';

export const MultipleSuggestion = ({onClick, operationType, suggestion, selectedSuggestion}: SuggestionProps) => (
  <button
    disabled={!!selectedSuggestion}
    className={`${classForComponent('suggestions-item-btn')} multiple`}
    id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
    <div className="suggestions-item-text">
      <EnsName value={suggestion} />
    </div>
    {suggestion !== selectedSuggestion
      ? <p className={classForComponent('suggestions-item-btn-text')}>{operationType}</p>
      : <Spinner className={classForComponent('spinner-small-center')} />}
  </button>
);
