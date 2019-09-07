import React, {useState} from 'react';
import {utils} from 'ethers';
import UniversalLoginSDK from '@universal-login/sdk';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import daiIcon from './../assets/icons/dai.svg';
import ethIcon from './../assets/icons/ether.svg';
import {Asset} from './Asset';
import './../styles/assetsList.sass';
import './../styles/assetsListDefaults.sass';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface AssetsProps {
  sdk: UniversalLoginSDK;
  ensName: string;
  className?: string;
}

const iconForToken = (symbol: string) => symbol === 'ETH' ? ethIcon : daiIcon;

export const Assets = ({sdk, ensName, className}: AssetsProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);

  return (
    <div className="universal-login-assets">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="assets">
          <p className="assets-title">My Assets</p>
          <div className="assets-list">
          {tokenDetailsWithBalance.map(({name, symbol, balance}: TokenDetailsWithBalance) => (
            <Asset
              key={`${name}-${symbol}`}
              sdk={sdk}
              name={name}
              symbol={symbol}
              balance={utils.formatEther(balance)}
              icon={iconForToken(symbol)}
              className={className}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
