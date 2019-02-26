import React from 'react';
import IdentitySelector from './IdentitySelector';
import Logo from './../../assets/logo-with-text.svg';
import {useServices, useRouter} from '../../hooks';

const Login = () => {
  const {createWallet} = useServices();
  const {history} = useRouter();

  const onCreateCLick = async (name: string) => {
    await createWallet(name);
    history.push('/');
  };

  return(
    <div className="login">
      <img src={Logo} alt="Logo" className="login-logo"/>
      <p className="login-subtitle">The best place to put your money anywhere on the planet. Universal finance for everyone.</p>
      <IdentitySelector  onCreateClick={(name: string) => onCreateCLick(name)}/>
    </div>
  );
};

export default Login;
