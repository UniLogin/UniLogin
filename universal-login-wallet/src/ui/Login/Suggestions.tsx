import React from 'react';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
}
const Suggestions = ({connections, creations}: SuggestionsProps) => {
  const connectionsSuggestions = connections.map((name => (
    <li
      key={`connection_${name}`}
    >
      <span>{name}</span>
      <button>connect</button>
    </li>)
  ));
  const creationsSuggestions = creations.map((name => (
    <li
      key={`create_${name}`}
    >
      <span>{name}</span>
      <button>create</button>
    </li>)
  ));
  const recoversSuggestions = connections.map((name => (
    <li
      key={`recover_${name}`}
    >
      <span>{name}</span>
      <button>recover</button>
    </li>)
  ));

  return (
    <ul>
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
