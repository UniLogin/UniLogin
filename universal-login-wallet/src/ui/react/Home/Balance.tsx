import React, {useState, useEffect, useContext} from 'react';
import {useServices} from '../../hooks';
import {utils} from 'ethers';
import ReceiveIcon from './../../assets/icons/receive.svg';
import SendIcon from './../../assets/icons/send.svg';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const Balance = () => {
  const modalService = useContext(WalletModalContext);
  const [balance, setBalance] = useState(utils.bigNumberify(0));
  const {balanceService} = useServices();

  useEffect(() => balanceService.subscribe(setBalance), []);

  return(
    <section className="balance">
      <h2 className="balance-title">Balance</h2>
      <p className="balance-amount"><span className="balance-amount-highlighted">{utils.formatEther(balance)}</span> ETH</p>
      <div className="balance-row">
        <button
          onClick={() => modalService.showModal('request')}
          className="balance-btn balance-btn-receive"
        >
          <img src={ReceiveIcon} alt="arrow up"/>
          Receive
        </button>
        <button
          id="transferFunds"
          onClick={() => modalService.showModal('transfer')}
          className="balance-btn balance-btn-send"
        >
          <img src={SendIcon} alt="arrow down"/>
          Send
        </button>
      </div>
    </section>
  );
};

export default Balance;
