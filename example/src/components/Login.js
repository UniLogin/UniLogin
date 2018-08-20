import React, { Component } from 'react';
import IdentitySelector from './IdentitySelector';
import PropTypes from 'prop-types';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      identity: ''
    };
  }

  async onNextClick() {
    const {emitter} = this.props.services;
    const {identityService} = this.props.services;
    emitter.emit('setView', 'CreatingID');
    await identityService.createIdentity(this.state.identity);
    emitter.emit('setView', 'Greeting');
  }

  onChange(identity) {
    this.setState({identity});
  }

  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Universal Logins</h1>
          <p className="login-view-text">
            This is an example app for implementing ERC1077&1078 in Ethereum.
            You can use this example to build your own app.
          </p>
          <IdentitySelector onNextClick={() => this.onNextClick()} onChange={this.onChange.bind(this)}/>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  services: PropTypes.object
};


export default Login;
