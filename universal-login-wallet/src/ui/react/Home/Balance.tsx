import React, {useState, useContext} from 'react';
import {CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '@universal-login/react';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';
import ReceiveIcon from './../../assets/icons/receive.svg';
import SendIcon from './../../assets/icons/send.svg';
import {useServices} from '../../hooks';

const Balance = () => {
  const modalService = useContext(WalletModalContext);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const {sdk, walletPresenter} = useServices();

  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(walletPresenter.getName(), (totalBalances: CurrencyToValue) => setTotalBalance(totalBalances['USD'])), []);

  return(
    <section className="balance">
      <h2 className="balance-title">Total Balance</h2>
      <p className="balance-amount"><span className="balance-amount-highlighted">{totalBalance}</span> $</p>
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
