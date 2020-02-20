import React, {useState} from 'react';
import {utils} from 'ethers';
import {DeployedWallet} from '@unilogin/sdk';
import {TokenDetailsWithBalance} from '@unilogin/commons';
import {Asset} from './Asset';
import './../styles/assetsList.sass';
import './../styles/assetsListDefaults.sass';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {getIconForToken} from '../../core/utils/getIconForToken';

export interface AssetsProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const Assets = ({deployedWallet, className}: AssetsProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => deployedWallet.subscribeToBalances(setTokenDetailsWithBalance), []);

  return (
    <div className="universal-login-assets">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="assets">
          <p className="assets-title">My Assets</p>
          <div className="assets-list">
            {tokenDetailsWithBalance.map(({name, symbol, balance}: TokenDetailsWithBalance) => (
              <Asset
                key={`${name}-${symbol}`}
                sdk={deployedWallet.sdk}
                name={name}
                symbol={symbol}
                balance={utils.formatEther(balance)}
                icon={getIconForToken(symbol)}
                className={className}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
