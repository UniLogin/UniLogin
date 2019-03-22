import React from 'react';
import WalletSelector from './WalletSelector';
import Logo from './../../assets/logo-with-text.svg';
import Modal from '../Modals/Modal';
import {useServices, useRouter} from '../../hooks';
import {DEFAULT_LOCATION} from 'universal-login-commons';
import {utils} from 'ethers';

const MINIMUM_AMOUNT = utils.parseEther('0.005');

interface LoginProps {
  setAuthorized: () => void;
  location? : {state: {from: {pathname : string}}};
}

const Login = ({setAuthorized, location} : LoginProps) => {
  const {createWallet, modalService, balanceService} = useServices();
  const {history} = useRouter();
  const from = location && location.state ? location.state.from : DEFAULT_LOCATION;
  let unsubscribe : () => void;

  const onCreateCLick = async (name: string) => {
    await createWallet(name);
    modalService.showModal('address');
    unsubscribe = balanceService.subscribeBalance(isMinimumAmount);
  };

  const isMinimumAmount = (amount: string) => {
    if (utils.parseEther(amount).gte(MINIMUM_AMOUNT)) {
      setAuthorized();
      unsubscribe();
      history.push(from);
    }
  };
  return(
    <div className="login">
      <img src={Logo} alt="Logo" className="login-logo"/>
      <p className="login-subtitle">The best place to put your money anywhere on the planet. Universal finance for everyone.</p>
      <WalletSelector  onCreateClick={(name: string) => onCreateCLick(name)}/>
      <Modal />
    </div>
  );
};

export default Login;
