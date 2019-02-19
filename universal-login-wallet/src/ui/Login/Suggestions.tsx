import React from 'react';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
}

const getSuggestionsList = (operationType: string, array: string[]) =>
  array.map((element => (
    <li key={`${operationType}_${element}`}>
      <span>{element}</span>
      <button>{operationType}</button>
    </li>)
  )
);

const Suggestions = ({connections, creations}: SuggestionsProps) => {
  const connectionsSuggestions = getSuggestionsList('connect', connections);
  const creationsSuggestions = getSuggestionsList('create', creations);
  const recoversSuggestions = getSuggestionsList('recover', connections);

  return (
    <ul>
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
