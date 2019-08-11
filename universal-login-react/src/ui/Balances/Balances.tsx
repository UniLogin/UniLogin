import React, {useState, useEffect} from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';


interface BalancesProps {
  walletContractAddress: string;
  onSubscribeToBalances: Function;
  onSubscribeToAggregateBalance: Function;
}

export const Balances = ({walletContractAddress, onSubscribeToBalances, onSubscribeToAggregateBalance}: BalancesProps) => {
  const [aggregateBalance, setAggregateBalance] = useState({} as any);
  const [balances, setBalances] = useState([] as TokenDetailsWithBalance[]);
  useEffect(() => {
    const unsubscribeBalances = onSubscribeToBalances((balances: TokenDetailsWithBalance[]) => setBalances(balances));
    const unsubscribeTotalWorth = onSubscribeToAggregateBalance((aggregateBalance: {}) => setAggregateBalance(aggregateBalance));
    return () => {
      unsubscribeBalances();
      unsubscribeTotalWorth();
    };
  }, []);

  const getBalances = (balances: TokenDetailsWithBalance[]) => {
    return balances.map((token: TokenDetailsWithBalance) => (
      <li key={token.symbol}>
        <p>{token.symbol}: {token.balance.toString()}</p>
      </li>
    ));
  };

  const getAggregateBalance = (aggregateBalance: {}) => {
    return Object.entries(aggregateBalance)
      .map(([symbol, value]) => (
        <li key={symbol}>
          <p>{`${value} ${symbol}`}</p>
        </li>
      ));
  };

  const fetchedBalances = getBalances(balances);
  const fetchedAggregateBalance = getAggregateBalance(aggregateBalance);
  return (
    <div className="universal-login">
      <div>
        walletContractAddress: {walletContractAddress}
      </div>
      <div>
        <p>Total worth:</p>
        <ul>
          {fetchedAggregateBalance}
        </ul>
      </div>
      <div>
        <p>Token Balances:</p>
        <ul>
          {fetchedBalances}
        </ul>
      </div>
    </div>
  );
};
