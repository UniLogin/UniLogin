import ApproveConnectionView from '../views/ApproveConnectionView';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Wallet } from 'ethers';
import RecoverAccountAccordionView from '../views/RecoverAccountAccordionView';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class ApproveConnection extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.identityService = this.props.services.identityService;
    this.emitter = this.props.services.emitter;
    this.state = {
      backupCode: '',
      btnLabel: 'RECOVER ACCOUNT'
    };
  }

  async onCancelClick() {
    const { emitter } = this.props.services;
    emitter.emit('setView', 'Login');
    this.identityService.cancelSubscription();

    const { identityService } = this.props.services;
    const identityAddress = identityService.identity.address;
    const { address } = new Wallet(identityService.privateKey);
    const { sdk } = identityService;
    await sdk.denyRequest(identityAddress, address);
  }

  async onRecoverClick() {
    this.onCancelClick();
    const { identityService, sdk } = this.props.services;
    let wallet = await Wallet.fromBrainWallet(
      this.identityService.identity.name,
      this.state.backupCode
    );
    await sdk.addKey(
      identityService.identity.address,
      identityService.deviceAddress,
      wallet.privateKey,
      DEFAULT_PAYMENT_OPTIONS
    );
  }

  onChange(event) {
    this.setState({ backupCode: event.target.value });
  }

  setView(view) {
    this.emitter.emit('setView', view);
  }

  render() {
    return (
      <div className="container">
        <ApproveConnectionView
          btnLabel={this.state.btnLabel}
          onChange={this.onChange.bind(this)}
          onCancelClick={this.onCancelClick.bind(this)}
          onRecoverClick={this.onRecoverClick.bind(this)}
          identity={this.identityService.identity}
        />
        <RecoverAccountAccordionView setView={this.setView.bind(this)} />
      </div>
    );
  }
}

ApproveConnection.propTypes = {
  services: PropTypes.object
};

export default ApproveConnection;
