import React from 'react';
import IdentitySelector from './IdentitySelector';
import Logo from './../../assets/logo-with-text.svg';

const Login = (props: {services: any}) => {
  return(
  <div className="login">
    <img src={Logo} alt="Logo" className="login-logo"/>
    <p className="login-subtitle">The best place to put your money anywhere on the planet. Universal finance for everyone.</p>
    <IdentitySelector />
  </div>);
};

export default Login;
