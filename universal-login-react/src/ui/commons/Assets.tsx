import React, {useState} from 'react';
import {utils} from 'ethers';
import UniversalLoginSDK from '@universal-login/sdk';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import daiIcon from './../assets/icons/dai.svg';
import ethIcon from './../assets/icons/ether.svg';
import {Asset} from './Asset';
import './../styles/assets.css';
import {useAsyncEffect} from '../hooks/useAsyncEffect';

export interface AssetsProps {
  sdk: UniversalLoginSDK;
  ensName: string;
}

const iconForToken = (symbol: string) => symbol === 'ETH' ? ethIcon : daiIcon;

export const Assets = ({sdk, ensName}: AssetsProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);

  return (
    <div className="assets">
      <p className="assets-title">{'My Assets'}</p>
      <ul className="assets-list">
      {tokenDetailsWithBalance.map(({name, symbol, balance}: TokenDetailsWithBalance) => (
        <Asset
          key={`${name}-${symbol}`}
          sdk={sdk}
          name={name}
          symbol={symbol}
          balance={utils.formatEther(balance)}
          icon={iconForToken(symbol)}
        />
      ))}
      </ul>
    </div>
  );
};
