import React from 'react';
import {
  WALLET_SUGGESTION_ALL_ACTIONS,
  WalletSuggestionAction,
} from '@unilogin/commons';
import UniLoginSdk from '@unilogin/sdk';
import {EnsNamePicker} from './EnsNamePicker';
import './../styles/base/hint.sass';
import './../styles/base/walletSelector.sass';
import './../styles/themes/Legacy/walletSelectorThemeLegacy.sass';
import './../styles/themes/Jarvis/walletSelectorThemeJarvis.sass';
import './../styles/themes/UniLogin/walletSelectorThemeUniLogin.sass';
import {useClassFor} from '../utils/classFor';

export interface WalletSelectorProps {
  onCreateClick?(ensName: string): Promise<void> | void;
  onConnectClick?(ensName: string): Promise<void> | void;
  sdk: UniLoginSdk;
  domains: string[];
  actions?: WalletSuggestionAction[];
  className?: string;
  placeholder?: string;
}

export const WalletSelector = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions = WALLET_SUGGESTION_ALL_ACTIONS,
  placeholder = 'type a name',
  className,
}: WalletSelectorProps) => (
  <div className={useClassFor('wallet-selector-wrapper')}>
    <EnsNamePicker
      onCreateClick={onCreateClick}
      onConnectClick={onConnectClick}
      sdk={sdk}
      domains={domains}
      actions={actions}
      placeholder={placeholder}
    />
  </div>
);
