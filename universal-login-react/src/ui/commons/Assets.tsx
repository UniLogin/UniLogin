import React, {useState} from 'react';
import {utils} from 'ethers';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {TokenDetailsWithBalance, ValueRounder} from '@unilogin/commons';
import {Asset} from './Asset';
import './../styles/base/assetsList.sass';
import './../styles/themes/Legacy/assetsListThemeLegacy.sass';
import './../styles/themes/UniLogin/assetsListThemeUnilogin.sass';
import './../styles/themes/Jarvis/assetsListThemeJarvis.sass';
import {useBalances} from '../hooks/useBalances';
import {ThemedComponent} from './ThemedComponent';
import {filterTokensWithZeroBalance} from '../../app/filterTokensWithZeroBalance';
import {useErc721Tokens} from '../hooks/useErc721Tokens';
import Erc721Tokens from './Erc721Tokens';

export type AssetState = 'COLLECTABLES' | 'TOKENS';

export interface AssetsProps {
  deployedWallet: DeployedWithoutEmailWallet;
}

export const Assets = ({deployedWallet}: AssetsProps) => {
  const [tokenDetailsWithBalance] = useBalances(deployedWallet);
  const [erc721Tokens] = useErc721Tokens(deployedWallet);
  const [currentState, setCurrentState] = useState('TOKENS' as AssetState);

  return (
    <ThemedComponent name="assets">
      <div className="assets">
        <div className="assets-navigation">
          <a className={`${currentState !== 'TOKENS' ? 'assets-title' : 'assets-selected-title'}`} onClick={() => setCurrentState('TOKENS')}>Tokens</a>
          <a className={`${currentState === 'TOKENS' ? 'assets-title' : 'assets-selected-title'}`} onClick={() => setCurrentState('COLLECTABLES')}>Collectables</a>
        </div>
        <div className="assets-list">
          {currentState === 'TOKENS' && filterTokensWithZeroBalance(tokenDetailsWithBalance).map(({balance, ...token}: TokenDetailsWithBalance) => (
            <Asset
              key={`${token.name}-${token.symbol}`}
              sdk={deployedWallet.sdk}
              token={token}
              balance={ValueRounder.ceil(utils.formatUnits(balance, token.decimals))!}
            />
          ))}
          {currentState === 'COLLECTABLES' && <Erc721Tokens sdk={deployedWallet.sdk} tokens={erc721Tokens!}/>}
        </div>
      </div>
    </ThemedComponent>
  );
};
