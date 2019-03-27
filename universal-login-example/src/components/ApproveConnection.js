import ApproveConnectionView from '../views/ApproveConnectionView';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Wallet} from 'ethers';

class ApproveConnection extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.identityService = this.props.services.identityService;
    this.emitter = this.props.services.emitter;
    this.state = {
      backupCode: ''
    };
  }

  async removeRequest() {
    const {identityService, sdk} = this.props.services;
    this.identityService.cancelSubscription();

    const walletContractAddress = identityService.identity.address;
    const {address} = new Wallet(identityService.privateKey);
    await sdk.denyRequest(walletContractAddress, address);
  }

  async onCancelClick() {
    await this.removeRequest();
    this.emitter.emit('setView', 'Login');
  }

  async onAccountRecoveryClick() {
    await this.removeRequest();
    this.emitter.emit('setView', 'RecoverAccount', {greetMode: 1});
  }

  onChange(event) {
    const {emitter} = this.props.services;
    this.setState({backupCode: event.target.value});
    emitter.emit('setView', 'Greeting');
  }

  setView(view) {
    this.emitter.emit('setView', view);
  }

  render() {
    return (
      <div className="container">
        <ApproveConnectionView
          onChange={this.onChange.bind(this)}
          onCancelClick={this.onCancelClick.bind(this)}
          identity={this.identityService.identity}
          onAccountRecoveryClick={this.onAccountRecoveryClick.bind(this)}
        />
      </div>
    );
  }
}

ApproveConnection.propTypes = {
  services: PropTypes.object
};

export default ApproveConnection;
