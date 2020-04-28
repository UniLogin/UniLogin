import React, {ReactNode} from 'react';
import {MultipleSuggestion} from './MultipleSuggestion';
import {classForComponent} from '../../utils/classFor';
import {SuggestionItem} from '../../../core/models/Suggestion';
import {SingleSuggestion} from './SingleSuggestion';
import {SuggestionOperationType} from '../../../core/models/SuggestionProps';

interface SuggestionGroupProps {
  operationType: SuggestionOperationType;
  label: string;
  onClick: (ensName: string) => void;
  selectedSuggestion: string;
};

interface SuggestionGroupMultipleProps extends SuggestionGroupProps{
  suggestions: SuggestionItem[];
};

interface SuggestionGroupSingleProps extends SuggestionGroupProps {
  suggestion: string;
  hint: string;
};

interface SuggestionGroupWrapperProps {
  label: string;
  children: ReactNode;
}

const SuggestionGroupWrapper = ({label, children}: SuggestionGroupWrapperProps) => (
  <div className={classForComponent('suggestions-group')}>
    <p className={classForComponent('suggestions-group-label')}>{label}</p>
    {children}
  </div>
);

export const SuggestionGroupMultiple = ({suggestions, label, operationType, onClick, selectedSuggestion}: SuggestionGroupMultipleProps) => {
  return (
    <SuggestionGroupWrapper label={label}>
      <ul className={classForComponent('suggestions-list')}>
        {suggestions.map(element => (
          <li key={element.name} className={classForComponent('suggestions-item')}>
            <MultipleSuggestion
              suggestion={element.name}
              selectedSuggestion={selectedSuggestion}
              operationType={operationType}
              onClick={onClick}
            />
          </li>
        ))}
      </ul>
    </SuggestionGroupWrapper>
  );
};

export const SuggestionGroupSingle = ({suggestion, label, operationType, onClick, selectedSuggestion, hint}: SuggestionGroupSingleProps) => {
  return (
    <SuggestionGroupWrapper label={label}>
      <div>
        <ul className={classForComponent('suggestions-list')}>
          <li className={classForComponent('suggestions-item')}>
            <SingleSuggestion
              suggestion={suggestion}
              selectedSuggestion={selectedSuggestion}
              operationType={operationType}
              onClick={onClick}
              hint={hint}
            />
          </li>
        </ul>
      </div>
    </SuggestionGroupWrapper>
  );
};
