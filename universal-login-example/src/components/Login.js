import React, {Component} from 'react';
import IdentitySelector from './IdentitySelector';
import PropTypes from 'prop-types';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: ''
    };
    this.identityService = this.props.services.identityService;
    this.sdk = this.props.services.sdk;
  }

  async identityExist(identity) {
    return await this.identityService.identityExist(identity);
  }

  async onNextClick(identity) {
    const {emitter} = this.props.services;
    if (await this.identityExist(identity)) {
      await this.identityService.connect();
      emitter.emit('setView', 'ApproveConnection');
    } else {
      emitter.emit('setView', 'CreatingID');
      try {
        await this.identityService.createIdentity(identity);
        emitter.emit('setView', 'Greeting', {greetMode: 'created'});
      } catch (err) {
        emitter.emit('setView', 'Failure', {error: err.message});
      }
    }
  }

  async onAccountRecoveryClick(identity) {
    const {emitter} = this.props.services;
    await this.identityExist(identity);
    emitter.emit('setView', 'RecoverAccount');
  }

  onChange(identity) {
    this.setState({identity});
  }

  render() {
    const {ensDomains} = this.props.services.config;
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Universal Logins</h1>
          <p className="login-view-text">
            This is an example app for implementing ERC1077&1078 in Ethereum.
            You can use this example to build your own app.
          </p>
          <IdentitySelector
            onNextClick={(identity) => this.onNextClick(identity)}
            onChange={this.onChange.bind(this)}
            ensDomains={ensDomains}
            onAccountRecoveryClick={this.onAccountRecoveryClick.bind(this)}
            identityExist = {this.identityExist.bind(this)}
            identitySelectionService={this.props.services.identitySelectionService}
          />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  services: PropTypes.object
};


export default Login;
