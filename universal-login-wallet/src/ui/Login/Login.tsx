import React, { useState } from 'react';
import WalletSelector from './WalletSelector';
import { renderBusyIndicator } from '../common/BusyIndicator'
import Logo from './../../assets/logo-with-text.svg';
import Modal from '../Modals/Modal';
import {useServices, useRouter} from '../../hooks';
import {DEFAULT_LOCATION, Procedure, sleep} from '@universal-login/commons';
import {utils} from 'ethers';

const MINIMUM_TOPUP_AMOUNT = utils.parseEther('0.005');

interface LoginProps {
  location? : {state: {from: {pathname : string}}};
}

const Login = ({location} : LoginProps) => {
  const [busy, setBusy] = useState(false);
  const {createWallet, modalService, balanceService, connectToWallet} = useServices();
  const {history} = useRouter();
  const from = location && location.state ? location.state.from : DEFAULT_LOCATION;
  let unsubscribe: Procedure;

  const onCreateCLick = async (name: string) => {
    setBusy(true);
    await sleep(1000)
    await createWallet(name);
    setBusy(false);
    modalService.showModal('address');
    unsubscribe = balanceService.subscribe(onBalanceChange);
    modalService.showModal('topUpAccount');
  };

  const onConnectionClick = async (name: string) => {
    setBusy(true);
    unsubscribe = await connectToWallet(name, loginAndChangeScreen);
    setBusy(false);
    history.push('/approve');
  };

  const loginAndChangeScreen = () => {
    unsubscribe();
    history.push(from);
  };

  const onBalanceChange = (amount: utils.BigNumber) => {
    if (amount.gte(MINIMUM_TOPUP_AMOUNT)) {
      loginAndChangeScreen();
    }
  };

  return(
    <div className="start login">
      <img src={Logo} alt="Logo" className="start-logo login-logo"/>
      <p className="start-subtitle login-subtitle">The best place to put your money anywhere on the planet. Universal finance for everyone.</p>
      <WalletSelector onCreateClick={(name: string) => onCreateCLick(name)} onConnectionClick={onConnectionClick}/>
      <Modal />
      {renderBusyIndicator(busy)}
    </div>
  );
};

export default Login;
