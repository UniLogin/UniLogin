import React, {useState} from 'react';
import {Redirect} from 'react-router';
import IdentitySelector from './IdentitySelector';
import Logo from './../../assets/logo-with-text.svg';
import { useServices } from '../../hooks';
import {Redirect} from 'react-router';

const Login = (props: {services: any}) => {
  const [, forceUpdate] = useState(false);
  const {createWallet, walletService} = useServices();

  const onCreateCLick = async (name: string) => {
    const [privateKey, contractAddress] = await createWallet(name);
    console.log('privateKey', privateKey);
    console.log('contractAddress', contractAddress);
    forceUpdate(true);
  };

   return walletService.userWallet ?
      <Redirect to={{ pathname: '/' }} />
    :
      (<div className="login">
        <img src={Logo} alt="Logo" className="login-logo"/>
        <p className="login-subtitle">The best place to put your money anywhere on the planet. Universal finance for everyone.</p>
        <IdentitySelector  onCreateClick={(name: string) => onCreateCLick(name)}/>
      </div>
      );
};

export default Login;
