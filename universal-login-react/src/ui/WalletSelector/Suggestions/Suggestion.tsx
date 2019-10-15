import React from 'react';
import {SuggestionType} from '../../../core/models/SuggestionType';
import {SingleCreationSuggestion} from './SingleCreationSuggestion';
import {MultipleSuggestion} from './MultipleSuggestion';
import {SuggestionProps} from '../../../core/models/SuggestionProps';

interface SuggestionWithTypeProps extends SuggestionProps {
  type?: SuggestionType;
}

export const Suggestion = ({type, ...props}: SuggestionWithTypeProps) => {
  switch (type) {
    case 'SingleCreation':
      return (<SingleCreationSuggestion {...props} />);
    case 'Multiple':
    default:
      return (<MultipleSuggestion {...props} />);
  }
};
