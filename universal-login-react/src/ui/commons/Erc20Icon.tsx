import React from 'react';
import {getIconForToken} from '../../core/utils/getIconForToken';

export interface Erc20IconProps {
  symbol: string;
  className?: string;
}

export const Erc20Icon = ({className, symbol}: Erc20IconProps) => {
  return <img src={getIconForToken(symbol)} alt={symbol} className={className} />;
};
