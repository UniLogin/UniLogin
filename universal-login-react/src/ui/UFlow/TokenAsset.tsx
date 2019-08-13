import React from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import {utils} from 'ethers';

export interface TokenAssetProps {
  token: TokenDetailsWithBalance;
}

export const TokenAsset = ({token}: TokenAssetProps) => {
  return (
    <div>
      <p>Name: {token.name}</p>
      <p>Symbol: {token.symbol}</p>
      <p>Balance: {utils.formatEther(token.balance)}</p>
    </div>
  );
};
