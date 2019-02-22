import React, {useState, ChangeEvent} from 'react';
import InputText from '../common/InputText';
import Suggestions from './Suggestions';
import {useServices} from '../../hooks';

interface IdentitySelector {
  onCreateClick: (...args: any[]) => void;
}

const IdentitySelector = ({onCreateClick}: IdentitySelector) => {
  const [busy, setBusy] = useState(false);
  const [connections, setConnections] = useState<string[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const [name, setName] = useState('');
  const {suggestionsService} = useServices();

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setName(name);
    setBusy(true);
    suggestionsService.getSuggestions(name, suggestions => {
      setConnections(suggestions.connections);
      setCreations(suggestions.creations);
      setBusy(false);
    });
  };

  return(
    <>
      <label htmlFor="loginInput" className="login-input-label">
        <p className="login-input-label-title">Type a nickname you want</p>
        <p className="login-input-label-text">(Or your current username if you’re already own one)</p>
      </label>
      <InputText
        id="loginInput"
        onChange={update}
        placeholder="bob.example.eth"
        value={name}
      />
      {busy && <div className="circle-loader input-loader"/>}
      {!busy && (connections.length || creations.length) &&
        <Suggestions connections={connections} creations={creations} onCreateClick={onCreateClick}/>
      }
    </>
  );
};

export default IdentitySelector;
