import React, {useState} from 'react';
import {utils} from 'ethers';
import {DeployedWallet} from '@universal-login/sdk';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {Asset} from './Asset';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {getIconForToken} from '../../core/utils/getIconForToken';
import {useClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/assetsList.sass';
import './../styles/themes/Legacy/assetsListThemeLegacy.sass';
import './../styles/themes/UniLogin/assetsListThemeUniLogin.sass';

export interface AssetsProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const Assets = ({deployedWallet, className}: AssetsProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => deployedWallet.subscribeToBalances(setTokenDetailsWithBalance), []);

  return (
    <div className={useClassFor('assets-wrapper')}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className={classForComponent('assets')}>
          <p className={classForComponent('assets-title')}>My Assets</p>
          <div className={classForComponent('assets-list')}>
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
