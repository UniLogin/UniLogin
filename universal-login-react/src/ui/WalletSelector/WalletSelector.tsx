import React, {useEffect, useRef, useState} from 'react';
import {
  DebouncedSuggestionsService,
  Suggestions,
  SuggestionsService,
  WALLET_SUGGESTION_ALL_ACTIONS,
  WalletSuggestionAction,
} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {Input} from '../commons/Input';
import {SuggestionsComponent} from './Suggestions';
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

export const WalletSelector = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions = WALLET_SUGGESTION_ALL_ACTIONS,
  className,
  placeholder = 'type a name',
  tryEnablingMetamask,
}: WalletSelector) => {
  const [debouncedSuggestionsService] = useState(() =>
    new DebouncedSuggestionsService(
      new SuggestionsService(sdk, domains, actions),
    ),
  );

  const [accountStatus, setAccountStatus] = useState(tryEnablingMetamask ? 'show-initial' : 'show-picker');
  const [ethAccount, setEthAccount] = useState('');

  const [ensName, setEnsName] = useState('');

  const [suggestions, setSuggestions] = useState<Suggestions | undefined>({connections: [], creations: []});
  useEffect(() => {
    setSuggestions(undefined);
    debouncedSuggestionsService.getSuggestions(ensName, setSuggestions);
  }, [ensName]);

  const busy = suggestions === undefined;

  const isOnlyCreateAction =
    actions.includes(WalletSuggestionAction.create) && actions.length === 1;
  const isNameAvailable =
    suggestions?.creations?.length === 0 && isOnlyCreateAction && !!ensName && !busy;

  const onDetectClick = async () => {
    const result = await tryEnablingMetamask?.();
    if (result) {
      setEthAccount(result);
      setAccountStatus('show-account');
    } else {
      setEthAccount('No web3');
      setAccountStatus('show-picker');
    }
  };

  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
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
            onChange={(event) => setEnsName(event.target.value.toLowerCase())}
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
            suggestions={suggestions ?? {creations: [], connections: []}}
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            actions={actions}
          />}
      </div>
    </div>
  );
};
