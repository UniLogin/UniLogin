import React, {Component} from 'react';
import WalletSelector from './WalletSelector';
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

  async onNextClick(identityName) {
    const {emitter} = this.props.services;
    if (await this.identityExist(identityName)) {
      emitter.emit('setView', 'ApproveConnection');
      await this.identityService.connect();
    } else {
      this.identityService.identity.name = identityName;
      emitter.emit('setView', 'CreatingID');
      try {
        await this.identityService.createWallet(identityName);
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
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Universal Logins Clicker</h1>
          <p className="login-view-text">
          Clicker is an example application, that demonstrates Universal Logins, a design pattern for storing funds and connecting to Ethereum applications.
          </p>
          <WalletSelector
            onNextClick={(identity) => this.onNextClick(identity)}
            onChange={this.onChange.bind(this)}
            onAccountRecoveryClick={this.onAccountRecoveryClick.bind(this)}
            services = {this.props.services}
            walletSelectionService={this.props.services.walletSelectionService}
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
