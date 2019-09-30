import React from 'react';
import './../styles/balance.sass';
import './../styles/balanceDefault.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {formatAmountInUSD} from '../../core/utils/formatAmountInUSD';

export interface BalanceProps {
  amount: string;
  className?: string;
}

export const Balance = ({amount, className}: BalanceProps) => (
  <div className="universal-login-balance">
    <div className={getStyleForTopLevelComponent(className)}>
      <p className="universal-login-balance-text">Balance</p>
      <p className="universal-login-balance-amount">{formatAmountInUSD(amount)}</p>
    </div>
  </div>
);
