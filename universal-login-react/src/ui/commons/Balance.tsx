import React from 'react';
import './../styles/balance.sass';
import './../styles/balanceDefault.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {formatCurrency} from '../../core/utils/formatCurrency';

export interface BalanceProps {
  amount: string;
  className?: string;
}

export const Balance = ({amount, className}: BalanceProps) => (
  <div className="universal-login-balance">
    <div className={getStyleForTopLevelComponent(className)}>
      <p className="universal-login-balance-text">Balance</p>
      <p className="universal-login-balance-amount">{formatCurrency(amount)}</p>
    </div>
  </div>
);
