import React from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {TokenAsset} from './TokenAsset';

interface TokenAssetsProps {
  tokensDetailsWithBalance: TokenDetailsWithBalance[];
}

export const TokenAssets = ({tokensDetailsWithBalance}: TokenAssetsProps) => {
  return (
    <div>
      {tokensDetailsWithBalance.map((token: TokenDetailsWithBalance) => (
        <TokenAsset token={token} key={token.symbol}/>
      ))}
    </div>
  );
};
