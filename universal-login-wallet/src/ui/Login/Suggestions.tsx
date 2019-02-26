import React from 'react';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
  onCreateClick: (...args: any[]) => void;
}

const getSuggestionsItems = (operationType: string, array: string[], onClick: (...args: any[]) => void) =>
  array.map((element => (
    <li
      key={`${operationType}_${element}`}
      className="suggestions-item"
    >
      <button className="suggestions-item-btn" onClick={() => onClick(element)}>
        <p className="suggestions-item-text">{element}</p>
        <p className="suggestions-item-btn-text">{operationType}</p>
      </button>
    </li>)
  )
);

const Suggestions = ({connections, creations, onCreateClick}: SuggestionsProps) => {
  const connectionsSuggestions = getSuggestionsItems('connect to existing', connections, () => alert('not implemented'));
  const creationsSuggestions = getSuggestionsItems('create new', creations, onCreateClick);
  const recoversSuggestions = getSuggestionsItems('recover', connections, () => alert('not implemented'));
  return (
    <ul className="suggestions-list">
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
