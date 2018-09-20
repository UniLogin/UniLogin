import React, { Component } from 'react';

class LoginView extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Universal Logins</h1>
          <p className="login-view-text">This is an example app for implementing ERC1077&1078 in Ethereum. You can use this example to build your own app.</p>
          <div>
            <p className="login-method active">Create a new Ethereum ID or</p>
            <p className="login-method">Connect to an existing ID</p>
          </div>
          <div className="id-selector">
            <input className="input login-view-input" type="text" placeholder="type an username"/>
            <div className="dropdown">
              <button className="dropdown-btn">.universal-id.eth</button>
            </div>
          </div>
          <button className="btn fullwidth">Next</button>
        </div>
      </div>
    );
  }
}

export default LoginView;