import React from 'react';

interface SuggestionsProps {
  connections: string[];
  creations: string[];
}
const Suggestions = ({connections, creations}: SuggestionsProps) => {
  const connectionsSuggestions = connections.map((name => (
    <li key={`connection_${name}`} >
      <span className= { "identity" }>{name}</span>
      <button className= { "create" }>connect</button>
    </li>)
  ));
  const creationsSuggestions = creations.map((name => (
    <li
      key={`create_${name}`}
    >
      <span className= { "identity" }>{name}</span>
      <button className= { "create" }>create</button>
    </li>)
  ));
  const recoversSuggestions = connections.map((name => (
    <li
      key={`recover_${name}`}
    >
      <span className= { "identity" }>{name}</span>
      <button className= { "create" }>recover</button>
    </li>)
  ));

  return (
    <ul className="loginHover">
      {connectionsSuggestions}
      {creationsSuggestions}
      {recoversSuggestions}
    </ul>
  );
};

export default Suggestions;
