import React from 'react';
import {utils} from 'ethers';
import {DeployedWallet} from '@unilogin/sdk';
import {TokenDetailsWithBalance, ValueRounder} from '@unilogin/commons';
import {Asset} from './Asset';
import './../styles/assetsList.sass';
import './../styles/themes/Legacy/assetsListThemeLegacy.sass';
import './../styles/themes/UniLogin/assetsListThemeUnilogin.sass';
import {getIconForToken} from '../../core/utils/getIconForToken';
import {useBalances} from '../hooks/useBalances';
import {ThemedComponent} from './ThemedComponent';

export interface AssetsProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const Assets = ({deployedWallet, className}: AssetsProps) => {
  const [tokenDetailsWithBalance] = useBalances(deployedWallet);

  return (
    <ThemedComponent name="assets">
      <div className="assets">
        <p className="assets-title">My Assets</p>
        <div className="assets-list">
          {tokenDetailsWithBalance.map(({name, symbol, balance}: TokenDetailsWithBalance) => (
            <Asset
              key={`${name}-${symbol}`}
              sdk={deployedWallet.sdk}
              name={name}
              symbol={symbol}
              balance={ValueRounder.ceil(utils.formatEther(balance))!}
              icon={getIconForToken(symbol)}
              className={className}
            />
          ))}
        </div>
      </div>
    </ThemedComponent>
  );
};
