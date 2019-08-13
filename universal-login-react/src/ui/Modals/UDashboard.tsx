import React, {useContext, useState} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';
import {useServices} from '../../core/services/useServices';
import {TokenDetailsWithBalance, CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {utils} from 'ethers';

export interface UDashboardProps {
  ensName: string;
}

const UDashboard = ({ensName}: UDashboardProps) => {
  const modalService = useContext(ReactUModalContext);

  switch (modalService.modalState) {
    case 'funds':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <Header />
          <Funds ensName={ensName}/>
        </ModalWrapper>
      );
    case 'approveDevice':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <Header />
          <ApproveDevice />
        </ModalWrapper>
      );
    case 'settings':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <Header />
          <Settings />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export const Header = () => {
  const modalService = useContext(ReactUModalContext);
  return (
    <div>
      <button onClick={() => modalService.showModal('funds')}>Funds</button>
      <button onClick={() => modalService.showModal('approveDevice')}>ApproveDevice</button>
      <button onClick={() => modalService.showModal('settings')}>Settings</button>
    </div>
  );
};

interface FundsProps {
  ensName: string;
}

export const Funds = ({ensName}: FundsProps) => {
  const {sdk} = useServices();
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);
  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(ensName, setTotalTokensValue), []);

  return (
    <div>
      <div>
        Total: ${totalTokensValue['USD']}
      </div>
      <div>
        My assets:
      </div>
      {
        tokenDetailsWithBalance.map((token: TokenDetailsWithBalance) => (
          <TokenDetailsWithBalanceComponent token={token} key={token.symbol}/>
          ))
        }
    </div>
    );
};

export interface TokenDetailsWithBalanceComponentProps {
  token: TokenDetailsWithBalance;
}

export const TokenDetailsWithBalanceComponent = ({token}: TokenDetailsWithBalanceComponentProps) => {
  return (
    <div>
      <p>Name: {token.name}</p>
      <p>Symbol: {token.symbol}</p>
      <p>Balance: {utils.formatEther(token.balance)}</p>
    </div>
  );
};

export const ApproveDevice = () => {
  return (
    <div>ApproveDevice</div>
  );
};

export const Settings = () => {
  return (
    <div>Settings</div>
  );
};

export default UDashboard;
