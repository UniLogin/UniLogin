import React from 'react';
import {formatCurrency} from '../../core/utils/formatCurrency';
import Spinner from './Spinner';

export interface BalanceProps {
  amount?: number;
}

export const Balance = ({amount}: BalanceProps) => {
  return (
    <div className="universal-login-balance">
      <div className="balance">
        {amount === undefined
          ? <div className="balance-spinner-wrapper">
            <Spinner className="balance-spinner" />
          </div>
          : <>
            <p className="balance-text">Your total balance</p>
            <p className="balance-amount">{formatCurrency(amount.toString())}</p>
          </>
        }
      </div>
    </div>
  );
};
