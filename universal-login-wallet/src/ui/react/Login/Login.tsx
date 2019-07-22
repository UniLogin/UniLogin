import React from 'react';
import {WalletSelector} from '@universal-login/react';
import Logo from './../../assets/logo-with-text.svg';
import Modal from '../Modals/Modal';
import {useServices, useRouter} from '../../hooks';
import {DEFAULT_LOCATION, Procedure, defaultDeployOptions} from '@universal-login/commons';

interface LoginProps {
  location? : {state: {from: {pathname : string}}};
}

const Login = ({location} : LoginProps) => {
  const {modalService, connectToWallet, walletService, sdk} = useServices();
  const {history} = useRouter();
  const from = location && location.state ? location.state.from : DEFAULT_LOCATION;
  let unsubscribe: Procedure;

  const onCreateCLick = async (name: string) => {
    const {deploy, waitForBalance} = await walletService.createFutureWallet();
    modalService.showModal('topUpAccount');
    await waitForBalance();
    modalService.showModal('waitingForDeploy');
    await deploy(name, defaultDeployOptions.gasPrice.toString());
    walletService.setDeployed(name);
    history.push(from);
  };

  const onConnectionClick = async (name: string) => {
    unsubscribe = await connectToWallet(name, loginAndChangeScreen);
    history.push('/approve');
  };

  const loginAndChangeScreen = () => {
    unsubscribe();
    history.push(from);
  };

  return(
    <div className="start login">
      <img src={Logo} alt="Logo" className="start-logo login-logo"/>
      <p className="start-subtitle login-subtitle">The best place to put your money anywhere on the planet. Universal finance for everyone.</p>
        <WalletSelector
          onCreateClick={(name: string) => onCreateCLick(name)}
          onConnectionClick={onConnectionClick}
          sdk={sdk}
          domains={['mylogin.eth']}
        />
      <Modal />
    </div>
  );
};

export default Login;
