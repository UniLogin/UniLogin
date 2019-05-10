import React, {useState, ChangeEvent} from 'react';
import Input from '../common/Input';
import {renderBusyIndicator} from '../common/BusyIndicator';
import Suggestions from './Suggestions';
import {useServices} from '../../hooks';

interface WalletSelector {
  onCreateClick: (...args: any[]) => void;
  onConnectionClick: (...args: any[]) => void;
  setLoader: (arg: boolean) => void;
}

const WalletSelector = ({onCreateClick, onConnectionClick}: WalletSelector) => {
  const [busy, setBusy] = useState(false);
  const [connections, setConnections] = useState<string[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const [, setName] = useState('');
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

  const renderSuggestions = () =>
    !busy && (connections.length || creations.length) ?
      <Suggestions connections={connections} creations={creations} onCreateClick={onCreateClick} onConnectionClick={onConnectionClick} /> :
      null;

  return(
    <>
      <label htmlFor="loginInput" className="login-input-label">
        <p className="login-input-label-title">Type a nickname you want</p>
        <p className="login-input-label-text">(Or your current username if you’re already own one)</p>
      </label>
      <Input
          id="loginInput"
          onChange={(event: ChangeEvent<HTMLInputElement>) => update(event)}
          placeholder="bob.example.eth"
          autoFocus
      />
      {renderBusyIndicator(busy)}
      {renderSuggestions()}
    </>
  );
};

export default WalletSelector;
