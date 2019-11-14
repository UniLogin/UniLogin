import React from 'react';
import {SuggestionType} from '../../../core/models/SuggestionType';
import {SingleSuggestion} from './SingleSuggestion';
import {MultipleSuggestion} from './MultipleSuggestion';
import {SuggestionProps} from '../../../core/models/SuggestionProps';

interface SuggestionWithTypeProps extends SuggestionProps {
  type?: SuggestionType;
}

export const Suggestion = ({type, ...props}: SuggestionWithTypeProps) => {
  switch (type?.kind) {
    case 'Creation':
      return (<SingleSuggestion
        hint='This username is available'
        {...props}
      />);
    case 'Connection':
      return (<SingleSuggestion
        hint='Do you want to connect to this account?'
        {...props}
      />);
    case 'Available':
    default:
      return (<MultipleSuggestion {...props} />);
  }
};
