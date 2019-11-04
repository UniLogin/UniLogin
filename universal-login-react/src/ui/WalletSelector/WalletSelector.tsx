import React, {useState, ChangeEvent, useRef} from 'react';
import {
  DebouncedSuggestionsService,
  WalletSuggestionAction,
  WALLET_SUGGESTION_ALL_ACTIONS,
  SuggestionsService,
  ensureNotNull,
} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {Input} from '../commons/Input';
import {Suggestions} from './Suggestions';
import {renderBusyIndicator} from './BusyIndicator';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import Logo from './../assets/logo.svg';
import ethLogo from '../assets/icons/ethereum-logo.svg';
import './../styles/walletSelector.css';
import './../styles/walletSelectorDefaults.css';
import './../styles/hint.css';
import {MissingParameter} from '../../core/utils/errors';
import {useOutsideClick} from '../hooks/useClickOutside';

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
  const [connections, setConnections] = useState<string[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const [ensName, setEnsName] = useState('');
  const [accountStatus, setAccountStatus] = useState(tryEnablingMetamask ? 'show-initial' : 'show-picker');
  const [ethAccount, setEthAccount] = useState('');
  const [suggestionsVisible, setSuggenstionsVisible] = useState(false);
  const isOnlyCreateAction =
    actions.includes(WalletSuggestionAction.create) && actions.length === 1;
  const isNameAvailable =
    creations.length === 0 && isOnlyCreateAction && !!ensName && !busy;

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.toLowerCase();
    setEnsName(name);
    setBusy(true);
    debouncedSuggestionsService.getSuggestions(name, suggestions => {
      setConnections(suggestions.connections);
      setCreations(suggestions.creations);
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

  const renderSuggestions = () => {
    actions.includes(WalletSuggestionAction.connect) && ensureNotNull(onConnectClick, MissingParameter, 'onConnectClick');
    actions.includes(WalletSuggestionAction.create) && ensureNotNull(onCreateClick, MissingParameter, 'onCreateClick');
    return !busy &&
      <Suggestions
        source={ensName}
        connections={connections}
        creations={creations}
        onCreateClick={onCreateClick!}
        onConnectClick={onConnectClick!}
        actions={actions}
      />;
  };

  const ref = useRef(null);
  useOutsideClick(ref, () => setSuggenstionsVisible(false));

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
            onFocus={() => setSuggenstionsVisible(true)}
          />
          {isNameAvailable && (
            <div className="hint">Name is already taken or is invalid</div>
          )}
          {renderBusyIndicator(busy)}
        </div>
        <button className="selector-sign-button" onClick={onDetectClick}>
          <img className="selector-sign-img" src={ethLogo} alt="Ethereum Logo" />
          <p className="selector-sign-text">Sign in with Ethereum</p>
        </button>
        <div className="ethereum-account">
          <img className="ethereum-account-img" src={ethLogo} alt="Ethereum Logo" />
          <p className="ethereum-account-text">{ethAccount}</p>
        </div>
        {suggestionsVisible && renderSuggestions()}
      </div>
    </div>
  );
};
