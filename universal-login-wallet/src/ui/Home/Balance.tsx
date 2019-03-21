import React, {useState, useEffect} from 'react';
import {useServices} from '../../hooks';

interface BalanceProps {
  className?: string;
}

const Balance = ({className} : BalanceProps) => {
  const [balance, setBalance] = useState(0);
  const {balanceService} = useServices();

  useEffect(() => balanceService.subscribeBalance(setBalance), []);

  return(
    <section className={`${className ? className : ''}`}>
      <h2 className="balance-title">Your balance</h2>
      <div className="balance-box">
        <p className="balance-amount"><span className="balance-amount-highlighted">{balance}</span>ETH</p>
      </div>
    </section>
  );
};

export default Balance;
