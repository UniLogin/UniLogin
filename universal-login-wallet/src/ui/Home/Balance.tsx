import React, {useState, useEffect} from 'react';
import {useServices} from '../../hooks';
import {utils} from 'ethers';

interface BalanceProps {
  className?: string;
}

const Balance = ({className} : BalanceProps) => {
  const [balance, setBalance] = useState(utils.bigNumberify(0));
  const {balanceService} = useServices();
  
  useEffect(() => balanceService.subscribe(setBalance), []);

  return(
    <section className={`${className ? className : ''}`}>
      <h2 className="balance-title">Your balance</h2>
      <div className="balance-box">
        <p className="balance-amount"><span className="balance-amount-highlighted">{utils.formatEther(balance)}</span>ETH</p>
      </div>
    </section>
  );
};

export default Balance;
