import React from 'react';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
  onItemClick: any;
}
const Suggestions = ({connections, creations, onItemClick}: SuggestionsProps) => {
  const creationsSuggestions = creations.map((name => (
    <li
      key={`create_${name}`}
      onClick={() => onItemClick(name)}
    >
      <span className= { "identity" }>{name}</span>
      <button className= { "create" }>create</button>
    </li>)
  ));
  return (
    <ul className="loginHover">
      {creationsSuggestions}
    </ul>
  );
};

export default Suggestions;
