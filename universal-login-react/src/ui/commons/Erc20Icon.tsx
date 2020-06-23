import React from 'react';
import {getIconForToken} from '../../core/utils/getIconForToken';
import {classForComponent} from '../utils/classFor';
import './../styles/themes/UniLogin/erc20IconThemeUnilogin.sass';

export interface Erc20IconProps {
  symbol: string;
  className?: string;
}

export const Erc20Icon = ({className, symbol}: Erc20IconProps) => {
  const tokenIcon = getIconForToken(symbol);
  if (tokenIcon) {
    return <img src={tokenIcon} alt={symbol} className={className} />;
  } else {
    return <div className={`${className} ${classForComponent('erc20-icon')}`}>
      {symbol}
    </div>;
  }
};
