import React from 'react';
import {utils} from 'ethers';
import UniversalLoginSDK from '@universal-login/sdk';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import daiIcon from './../assets/icons/dai.svg';
import ethIcon from './../assets/icons/ether.svg';
import {Asset} from './Asset';
import './../styles/my-assets.css';

export interface MyAssetsProps {
  sdk: UniversalLoginSDK;
  title?: string;
  assetsList: TokenDetailsWithBalance[];
}

const iconForToken = (symbol: string) => symbol === 'ETH' ? ethIcon : daiIcon;

export const MyAssets = ({sdk, title, assetsList}: MyAssetsProps) => (
  <div className="my-assets">
    <p className="my-assets-title">{title}</p>
    <ul className="my-assets-list">
    {assetsList.map(({name, symbol, balance}: TokenDetailsWithBalance) => (
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
