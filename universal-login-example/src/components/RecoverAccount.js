import RecoverAccountView from '../views/RecoverAccountView';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Wallet} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class RecoverAccount extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.identityService = this.props.services.identityService;
    this.emitter = this.props.services.emitter;
    this.state = {
      backupCode: '',
      isLoading: false,
      msg: ''
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
    this.setState({isLoading: true, msg: ''});
    const {identityService, sdk} = this.props.services;
    let wallet = await Wallet.fromBrainWallet(this.identityService.identity.name, this.state.backupCode);
    try {
      await sdk.addKey(identityService.identity.address, identityService.deviceAddress, wallet.privateKey, DEFAULT_PAYMENT_OPTIONS);
    } catch (error) {
      this.setState({isLoading: false, msg: 'Incorrect backup code, please retry'});
    }
  }

  onChange(event) {
    this.setState({backupCode: event.target.value});
  }

  setView(view) {
    this.emitter.emit('setView', view);
  }

  render() {
    return (<RecoverAccountView
      msg={this.state.msg}
      isLoading={this.state.isLoading}
      onChange={this.onChange.bind(this)}
      onCancelClick={this.onCancelClick.bind(this)}
      onRecoverClick={this.onRecoverClick.bind(this)}
      identity={this.identityService.identity}
    />);
  }
}

RecoverAccount.propTypes = {
  services: PropTypes.object
};

export default RecoverAccount;
