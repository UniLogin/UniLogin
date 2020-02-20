import React, {useState} from 'react';
import {
  WALLET_SUGGESTION_ALL_ACTIONS,
  WalletSuggestionAction,
} from '@unilogin/commons';
import UniversalLoginSDK from '@unilogin/sdk';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import ethLogo from '../assets/icons/ethereum-logo.svg';
import {EnsNamePicker} from './EnsNamePicker';
import {classForComponent, useClassFor} from '../utils/classFor';
import './../styles/hint.css';
import './../styles/base/walletSelector.sass';
import './../styles/themes/Legacy/walletSelectorThemeLegacy.sass';
import './../styles/themes/Jarvis/walletSelectorThemeJarvis.sass';
import './../styles/themes/UniLogin/walletSelectorThemeUniLogin.sass';

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
    <div className={`universal-login ${useClassFor(accountStatus)}`}>
      <div className={getStyleForTopLevelComponent(className)}>
        <EnsNamePicker
          onCreateClick={onCreateClick}
          onConnectClick={onConnectClick}
          sdk={sdk}
          domains={domains}
          actions={actions}
          placeholder={placeholder}
        />
        <button className={classForComponent('selector-sign-button')} onClick={onDetectClick}>
          <img className={classForComponent('selector-sign-img')} src={ethLogo} alt="Ethereum Logo" />
          <p className={classForComponent('selector-sign-text')}>Sign in with Ethereum</p>
        </button>
        <div className={classForComponent('ethereum-account')}>
          <img className={classForComponent('ethereum-account-img')} src={ethLogo} alt="Ethereum Logo" />
          <p className={classForComponent('ethereum-account-text')}>{ethAccount}</p>
        </div>
      </div>
    </div>
  );
};
