import React from 'react';
import {getIconForToken} from '../../core/utils/getIconForToken';
import {useThemeClassFor, classForComponent} from '../utils/classFor';
import './../styles/themes/UniLogin/erc20IconThemeUnilogin.sass';
import './../styles/themes/Jarvis/erc20IconThemeJarvis.sass';

export interface Erc20IconProps {
  symbol: string;
  className?: string;
}

export const Erc20Icon = ({className, symbol}: Erc20IconProps) => {
  const tokenIcon = getIconForToken(symbol);
  const theme = useThemeClassFor();
  if (tokenIcon) {
    return <img src={tokenIcon} alt={symbol} className={className} />;
  } else {
    return <div className={`${className} ${theme} ${classForComponent('erc20-icon')}`}>
      {symbol}
    </div>;
  }
};
