import React from 'react';
import {tokensIcons} from '../../../core/constants/tokensIcons';

export interface TokenIconProps {
  tokenName: string;
}

export const TokenIcon = ({tokenName}: TokenIconProps) => {
  const image: string | undefined = tokensIcons[tokenName];
  if (image) {
    return <img src={image} alt={tokenName} className="transaction-fee-item-icon" />;
  }
  return null;
};
