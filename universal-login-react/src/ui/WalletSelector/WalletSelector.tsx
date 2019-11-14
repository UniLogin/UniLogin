import React, {ChangeEvent, useRef, useState} from 'react';
import {
  DebouncedSuggestionsService,
  SuggestionsService,
  WALLET_SUGGESTION_ALL_ACTIONS,
  WalletSuggestionAction,
  Suggestions,
} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {Input} from '../commons/Input';
import {Suggestions as SuggestionsComponent} from './Suggestions';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import Logo from './../assets/logo.svg';
import ethLogo from '../assets/icons/ethereum-logo.svg';
import './../styles/walletSelector.css';
import './../styles/walletSelectorDefaults.css';
import './../styles/hint.css';
import {useOutsideClick} from '../hooks/useClickOutside';
import {Spinner} from '../..';

interface WalletSelector {
  onCreateClick?(ensName: string): Promise<void> | void;
  onConnectClick?(ensName: string): Promise<void> | void;
  sdk: UniversalLoginSDK;
  domains: string[];
  actions?: WalletSuggestionAction[];
  className?: string;
  placeholder?: string;
  tryEnablingMetamask?: () => Promise<string | undefined>;
}

const defaultInputPlaceholder = 'type a name';

export const WalletSelector = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions = WALLET_SUGGESTION_ALL_ACTIONS,
  className,
  placeholder = defaultInputPlaceholder,
  tryEnablingMetamask,
}: WalletSelector) => {
  const [debouncedSuggestionsService] = useState(
    new DebouncedSuggestionsService(
      new SuggestionsService(sdk, domains, actions),
    ),
  );
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions | undefined>(undefined);
  const [ensName, setEnsName] = useState('');
  const [accountStatus, setAccountStatus] = useState(tryEnablingMetamask ? 'show-initial' : 'show-picker');
  const [ethAccount, setEthAccount] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const isOnlyCreateAction =
    actions.includes(WalletSuggestionAction.create) && actions.length === 1;
  const isNameAvailable =
    suggestions?.creations?.length === 0 && isOnlyCreateAction && !!ensName && !busy;

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.toLowerCase();
    setEnsName(name);
    setBusy(true);
    debouncedSuggestionsService.getSuggestions(name, suggestions => {
      setSuggestions(suggestions);
      setBusy(false);
    });
  };

  const onDetectClick = async () => {
    const result = tryEnablingMetamask && await tryEnablingMetamask();
    if (result) {
      setEthAccount(result);
      setAccountStatus('show-account');
    } else {
      setEthAccount('No web3');
      setAccountStatus('show-picker');
    }
  };

  const ref = useRef(null);
  useOutsideClick(ref, () => setSuggestionsVisible(false));

  return (
    <div ref={ref} className={`universal-login ${accountStatus}`}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="selector-input-wrapper">
          <img
            src={Logo}
            alt="Universal login logo"
            className="selector-input-img"
          />
          <Input
            className="wallet-selector"
            id="loginInput"
            onChange={(event: ChangeEvent<HTMLInputElement>) => update(event)}
            placeholder={placeholder}
            autoFocus
            checkSpelling={false}
            onFocus={() => setSuggestionsVisible(true)}
          />
          {isNameAvailable && (
            <div className="hint">Name is already taken or is invalid</div>
          )}
          {busy && <Spinner className="spinner-busy-indicator"/>}
        </div>
        <button className="selector-sign-button" onClick={onDetectClick}>
          <img className="selector-sign-img" src={ethLogo} alt="Ethereum Logo" />
          <p className="selector-sign-text">Sign in with Ethereum</p>
        </button>
        <div className="ethereum-account">
          <img className="ethereum-account-img" src={ethLogo} alt="Ethereum Logo" />
          <p className="ethereum-account-text">{ethAccount}</p>
        </div>
        {suggestionsVisible && !busy &&
          <SuggestionsComponent
            source={ensName}
            connections={suggestions?.connections ?? []}
            creations={suggestions?.creations ?? []}
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            actions={actions}
          />}
      </div>
    </div>
  );
};
