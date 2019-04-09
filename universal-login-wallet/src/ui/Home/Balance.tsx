import React, {useState, useEffect} from 'react';
import {useServices} from '../../hooks';
import {utils} from 'ethers';
import EthereumIcon from './../../assets/icons/ethereum.svg';

interface BalanceProps {
  className?: string;
}

const Balance = ({className} : BalanceProps) => {
  const [balance, setBalance] = useState(utils.bigNumberify(0));
  const {balanceService} = useServices();

  useEffect(() => balanceService.subscribe(setBalance), []);

  return(
    <section className={`${className ? className : ''}`}>
      <div className="balance-icon-wrapper" hidden>
        <img src={EthereumIcon} alt="Ethereum" className="balance-icon" />
      </div>
      <h2 className="balance-title">balance</h2>
      <div className="balance-box">
        <p className="balance-amount">{utils.formatEther(balance)} ETH</p>
      </div>
    </section>
  );
};

export default Balance;
