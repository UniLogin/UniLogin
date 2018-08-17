import React, { Component } from 'react';
import IdentitySelector from './IdentitySelector';

class Login extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Universal Logins</h1>
          <p className="login-view-text">
            This is an example app for implementing ERC1077&1078 in Ethereum.
            You can use this example to build your own app.
          </p>
          <IdentitySelector />
        </div>
      </div>
    );
  }
}

export default Login;
