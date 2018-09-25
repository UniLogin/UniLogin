import ApproveConnectionView from '../views/ApproveConnectionView';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Wallet} from 'ethers';

class ApproveConnection extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.identityService = this.props.services.identityService;
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

  render() {
    return (<ApproveConnectionView
      onCancelClick={this.onCancelClick.bind(this)}
      identity= {this.identityService.identity}
    />);
  }
}

ApproveConnection.propTypes = {
  services: PropTypes.object
};

export default ApproveConnection;
