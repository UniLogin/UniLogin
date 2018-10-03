import ApproveConnectionView from '../views/ApproveConnectionView';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Wallet} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class ApproveConnection extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.identityService = this.props.services.identityService;
    this.state = {
      backupCode: '',
      btnLabel: 'RECOVER ACCOUNT'
    };
  }

  async onCancelClick() {
    const {emitter} = this.props.services;
    emitter.emit('setView', 'Login');
    this.identityService.cancelSubscription();

    const {identityService} = this.props.services;
    const identityAddress = identityService.identity.address;
    const {address} = new Wallet(identityService.privateKey);
    const {sdk} = identityService;
    await sdk.denyRequest(identityAddress, address);
  }

  async onRecoverClick() {
    this.setState({btnLabel: 'Recovering...'});
    const {identityService, sdk} = this.props.services;
    let wallet = await Wallet.fromBrainWallet(this.identityService.identity.name, this.state.backupCode);
    // TODO: We should probably write into the contract a 'Swap' function which adds a key and removes another key in one transaction.
    await sdk.addKey(identityService.identity.address, identityService.deviceAddress, wallet.privateKey, DEFAULT_PAYMENT_OPTIONS);
    await sdk.removeKey(identityService.identity.address, wallet.address, wallet.privateKey, DEFAULT_PAYMENT_OPTIONS);
  }

  onChange(event) {
    this.setState({backupCode: event.target.value});
  }

  render() {
    return (<ApproveConnectionView
      btnLabel={this.state.btnLabel}
      onChange={this.onChange.bind(this)}
      onCancelClick={this.onCancelClick.bind(this)}
      onRecoverClick={this.onRecoverClick.bind(this)}
      identity={this.identityService.identity}
    />);
  }
}

ApproveConnection.propTypes = {
  services: PropTypes.object
};

export default ApproveConnection;
