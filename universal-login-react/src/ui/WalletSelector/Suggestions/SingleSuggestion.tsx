import React from 'react';
import {SingleSuggestionProps} from '../../../core/models/SuggestionProps';
import {EnsName} from '../../commons/EnsName';
import {Spinner} from '../../commons/Spinner';
import {classForComponent} from '../../utils/classFor';
import {getSuggestionId} from '../../../app/getSuggestionId';

export const SingleSuggestion = ({onClick, operationType, suggestion, hint, selectedSuggestion}: SingleSuggestionProps) => {
  return (
    <div className={`${classForComponent('suggestions-item-btn')} single`}>
      <div className={classForComponent('suggestions-ens-name')}>
        <EnsName value={suggestion} />
      </div>
      <p className={classForComponent('single-suggestion-hint')}>{hint}</p>
      {selectedSuggestion === suggestion
        ? <Spinner className={classForComponent('spinner-small-center')} />
        : <button className={`${classForComponent('single-suggestion-btn')} ${classForComponent('suggestions-item-btn-text')}`} id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
          {operationType}
        </button>}
    </div>
  );
};
