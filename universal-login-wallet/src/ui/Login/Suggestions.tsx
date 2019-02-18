import React from 'react';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
}

const getSuggestionsItems = (operationType: string, array: string[]) =>
  array.map((element => (
    <li 
      key={`${operationType}_${element}`}
      className="suggestions-item">
      <button className="suggestions-item-btn">
        <p className="suggestions-item-text">{element}</p>
        <p className="suggestions-item-btn-text">{operationType}</p>
      </button>
    </li>)
  )
);

const Suggestions = ({connections, creations}: SuggestionsProps) => {
  const connectionsSuggestions = getSuggestionsItems('connect to existing', connections);
  const creationsSuggestions = getSuggestionsItems('create new', creations);
  const recoversSuggestions = getSuggestionsItems('recover', connections);
  return (
    <ul className="suggestions-list">
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
