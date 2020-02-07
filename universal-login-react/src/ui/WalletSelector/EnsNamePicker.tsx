import React, {useEffect, useState, useRef} from 'react';
import {
  DebouncedSuggestionsService,
  Suggestions,
  SuggestionsService,
  WalletSuggestionAction,
  WALLET_SUGGESTION_ALL_ACTIONS,
} from '@universal-login/commons';
import {SuggestionComponent} from './Suggestions';
import {Input} from '../commons/Input';
import Logo from './../assets/logo.svg';
import {Spinner} from '../..';
import {getSuggestion} from '../../core/utils/getSuggestion';
import UniversalLoginSDK from '@universal-login/sdk';
import {useOutsideClick} from '../hooks/useClickOutside';
import {useClassFor, classForComponent} from '../utils/classFor';
import {Suggestion} from '../../core/models/Suggestion';

export interface EnsNamePicker {
  onCreateClick?(ensName: string): Promise<void> | void;
  onConnectClick?(ensName: string): Promise<void> | void;
  sdk: UniversalLoginSDK;
  domains: string[];
  actions?: WalletSuggestionAction[];
  placeholder?: string;
}

export const EnsNamePicker = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions = WALLET_SUGGESTION_ALL_ACTIONS,
  placeholder = 'type a name',
}: EnsNamePicker) => {
  const [debouncedSuggestionsService] = useState(() =>
    new DebouncedSuggestionsService(
      new SuggestionsService(sdk, domains, actions),
    ),
  );

  const [ensName, setEnsName] = useState('');

  const [suggestions, setSuggestions] = useState<Suggestions | undefined>({connections: [], creations: []});

  const [suggestion, setSuggestion] = useState<Suggestion | undefined>({kind: 'None'});

  const setAllSuggestions = (suggestions: Suggestions) => {
    if (suggestions) {
      setSuggestions(suggestions);
      setSuggestion(getSuggestion(suggestions, actions, ensName));
    }
  };

  useEffect(() => {
    setSuggestions(undefined);
    debouncedSuggestionsService.getSuggestions(ensName, setAllSuggestions);
  }, [ensName]);

  const [suggestionVisible, setSuggestionVisible] = useState(false);

  const ref = useRef(null);
  useOutsideClick(ref, () => setSuggestionVisible(false));

  return (
    <div ref={ref}>
      <div className={useClassFor('selector-input-wrapper')}>
        <img
          src={Logo}
          alt="Universal login logo"
          className={classForComponent('selector-input-img')}
        />
        <Input
          className={`${classForComponent('input-wallet-selector')} ${suggestion?.kind === 'KeepTyping' && 'error'}`}
          id="loginInput"
          onChange={(event) => setEnsName(event.target.value.toLowerCase())}
          placeholder={placeholder}
          autoFocus
          checkSpelling={false}
          onFocus={() => setSuggestionVisible(true)}
        />
        {suggestions === undefined && ensName !== '' && <Spinner className={classForComponent('spinner-busy-indicator')} />}
      </div>
      {
        suggestionVisible && suggestions !== undefined && suggestion &&
        <SuggestionComponent
          suggestion={suggestion}
          onCreateClick={onCreateClick}
          onConnectClick={onConnectClick}
          actions={actions}
        />
      }
    </div>
  );
};
