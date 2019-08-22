import React, {useState, useContext} from 'react';
import {utils} from 'ethers';
import {TokenDetailsWithBalance, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {useAsyncEffect} from '@universal-login/react';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';
import ReceiveIcon from './../../assets/icons/receive.svg';
import SendIcon from './../../assets/icons/send.svg';
import {useServices} from '../../hooks';

const Balance = () => {
  const modalService = useContext(WalletModalContext);
  const [ethBalance, setEthBalance] = useState(utils.bigNumberify(0));
  const {sdk, walletPresenter} = useServices();

  const setBalanceCallback = (balances: TokenDetailsWithBalance[]) => {
    const ethDetails = balances.find((token: TokenDetailsWithBalance) => token.address === ETHER_NATIVE_TOKEN.address);
    const balance = ethDetails === undefined ? utils.bigNumberify(0) : ethDetails.balance;
    setEthBalance(balance);
  };

  useAsyncEffect(() => sdk.subscribeToBalances(walletPresenter.getName(), setBalanceCallback), []);

  return(
    <section className="balance">
      <h2 className="balance-title">Balance</h2>
      <p className="balance-amount"><span className="balance-amount-highlighted">{utils.formatEther(ethBalance)}</span> ETH</p>
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
