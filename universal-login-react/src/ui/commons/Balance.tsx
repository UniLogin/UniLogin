import React from 'react';
import './../styles/balance.css';

export interface BalanceProps {
  amount: string;
  className?: string;
}

export const Balance = ({amount, className}: BalanceProps) => (
  <div className={`universal-login-balance ${className ? className : ''}`}>
    <p className="universal-login-balance-text">Balance</p>
    <p className="universal-login-balance-amount">{amount}</p>
  </div>
);
