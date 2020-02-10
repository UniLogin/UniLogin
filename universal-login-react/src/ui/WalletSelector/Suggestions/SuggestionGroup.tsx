import React from 'react';
import {MultipleSuggestion} from './MultipleSuggestion';
import {classForComponent} from '../../utils/classFor';
import {SuggestionItem} from '../../../core/models/Suggestion';

interface SuggestionGroupProps {
  suggestions: SuggestionItem[];
  type: string;
  label: string;
  onClick: (ensName: string) => void;
  selectedSuggestion: string;
}

export const SuggestionGroup = ({suggestions, label, type, onClick, selectedSuggestion}: SuggestionGroupProps) => {
  return (
    <div className={classForComponent('suggestions-group')}>
      <p className={classForComponent('suggestions-group-label')}>{label}</p>
      <ul className={classForComponent('suggestions-list')}>
        {suggestions.map(element => (
          <li key={element.name} className={classForComponent('suggestions-item')}>
            <MultipleSuggestion
              suggestion={element.name}
              selectedSuggestion={selectedSuggestion}
              operationType={type}
              onClick={onClick}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}