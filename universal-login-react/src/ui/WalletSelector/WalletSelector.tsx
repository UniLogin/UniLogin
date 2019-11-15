import React, {useState} from 'react';
import {
  WALLET_SUGGESTION_ALL_ACTIONS,
  WalletSuggestionAction,
} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import ethLogo from '../assets/icons/ethereum-logo.svg';
import './../styles/walletSelector.css';
import './../styles/walletSelectorDefaults.css';
import './../styles/hint.css';
import {EnsNamePicker} from './EnsNamePicker';

export interface WalletSelectorProps {
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
  placeholder = 'type a name',
  className,
  tryEnablingMetamask,
}: WalletSelectorProps) => {
  const [accountStatus, setAccountStatus] = useState(tryEnablingMetamask ? 'show-initial' : 'show-picker');
  const [ethAccount, setEthAccount] = useState('');

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

  return (
    <div className={`universal-login ${accountStatus}`}>
      <div className={getStyleForTopLevelComponent(className)}>
        <EnsNamePicker
          onCreateClick={onCreateClick}
          onConnectClick={onConnectClick}
          sdk={sdk}
          domains={domains}
          actions={actions}
          placeholder={placeholder}
        />
        <button className="selector-sign-button" onClick={onDetectClick}>
          <img className="selector-sign-img" src={ethLogo} alt="Ethereum Logo" />
          <p className="selector-sign-text">Sign in with Ethereum</p>
        </button>

        <div className="ethereum-account">
          <img className="ethereum-account-img" src={ethLogo} alt="Ethereum Logo" />
          <p className="ethereum-account-text">{ethAccount}</p>
        </div>
      </div>
    </div>
  );
};
