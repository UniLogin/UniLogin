import React from 'react';
import IdentitySelector from './IdentitySelector';

const Login = (props: {services: any}) => {
  return(
  <div className="login">
    <h1>Universal Wallet</h1>
    <IdentitySelector services={props.services}/>
  </div>);
};

export default Login;
