import React, {Component} from 'react';
import WalletSelector from './WalletSelector';
import PropTypes from 'prop-types';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletContract: ''
    };
    this.walletContractService = this.props.services.walletContractService;
    this.sdk = this.props.services.sdk;
  }

  async getWalletContractAddress(walletContract) {
    return await this.walletContractService.getWalletContractAddress(walletContract);
  }

  async onNextClick(walletContractName) {
    const {emitter} = this.props.services;
    if (await this.getWalletContractAddress(walletContractName)) {
      emitter.emit('setView', 'ApproveConnection');
      await this.walletContractService.connect();
    } else {
      this.walletContractService.walletContract.name = walletContractName;
      emitter.emit('setView', 'CreatingID');
      try {
        await this.walletContractService.createWallet(walletContractName);
        emitter.emit('setView', 'Greeting', {greetMode: 'created'});
      } catch (err) {
        emitter.emit('setView', 'Failure', {error: err.message});
      }
    }
  }

  async onAccountRecoveryClick(walletContract) {
    const {emitter} = this.props.services;
    await this.getWalletContractAddress(walletContract);
    emitter.emit('setView', 'RecoverAccount');
  }

  onChange(walletContract) {
    this.setState({walletContract});
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
            onNextClick={(walletContract) => this.onNextClick(walletContract)}
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
