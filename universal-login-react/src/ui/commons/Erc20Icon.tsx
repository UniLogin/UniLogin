import React from 'react';
import {Coingecko, TokenDetails} from '@unilogin/commons';
import {useClassFor} from '../utils/classFor';
import './../styles/themes/UniLogin/erc20IconThemeUnilogin.sass';
import './../styles/themes/Jarvis/erc20IconThemeJarvis.sass';
import {useAsync} from '../hooks/useAsync';
import {getIconForToken} from '../../core/utils/getIconForToken';

export interface Erc20IconProps {
  token: TokenDetails;
  className?: string;
}

export const Erc20Icon = ({className, token}: Erc20IconProps) => {
  const {symbol} = token;
  const tokenIcon = getIconForToken(symbol);
  if (tokenIcon) {
    return <img src={tokenIcon} alt={symbol} className={className} />;
  } else {
    return <Erc20CoingeckoToken className={className} token={token} />;
  }
};

export interface Erc20SymbolProps {
  symbol: string;
  className?: string;
}

const Erc20CoingeckoToken = ({className, token}: Erc20IconProps) => {
  const [imageUrl] = useAsync(() => new Coingecko().fetchTokenImageUrl(token), [token]);
  if (imageUrl) {
    return <img src={imageUrl} alt={token.symbol} className={className} />;
  } else {
    return <Erc20Symbol className={className} symbol={token.symbol} />;
  }
};

const Erc20Symbol = ({className, symbol}: Erc20SymbolProps) =>
  <div className={`${className} ${useClassFor('erc20-icon')}`}>
    {symbol}
  </div>;
