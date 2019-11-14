import React from 'react';
import {getSuggestionId} from '@universal-login/commons';
import {SingleSuggestionProps} from '../../../core/models/SuggestionProps';
import {EnsName} from '../../commons/EnsName';
import {Spinner} from '../../commons/Spinner';

export const SingleSuggestion = ({onClick, operationType, suggestion, hint, selectedSuggestion}: SingleSuggestionProps) => {
  return (
    <>
      <div className="suggestions-ens-name">
        <EnsName value={suggestion} />
      </div>
      <p className="suggestions-hint">{hint}</p>
      {selectedSuggestion === suggestion
        ? <Spinner className='spinner-small-center' />
        : <button className="single-suggestion-btn" id={getSuggestionId(operationType)} onClick={() => onClick(suggestion)}>
          {operationType}
        </button>}
    </>
  );
};
