import React from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {formatCurrency} from '../../core/utils/formatCurrency';
import Spinner from './Spinner';

export interface BalanceProps {
  amount: number | undefined;
  className?: string;
}

export const Balance = ({amount, className}: BalanceProps) => {
  return (
    <div className="universal-login-balance">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="balance">
          {amount === undefined
            ? <div className="balance-spinner-wrapper">
              <Spinner className="balance-spinner" />
            </div>
            : <>
              <p className="balance-text">Balance</p>
              <p className="balance-amount">{formatCurrency(amount.toString())}</p>
            </>
          }
        </div>
      </div>
    </div>
  );
};
