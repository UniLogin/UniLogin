import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DevicesModalView from '../views/DevicesModalView';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class DevicesModal extends Component {

  constructor(props) {
    super(props);
  }

  async removeDevice() {
    const publicKey = this.props.publicKey;
    const { identityService, storageService, sdk, emitter} = this.props.services;
    const to = identityService.identity.address;
    const {privateKey} = identityService.identity;
    await sdk.removeKey(to, publicKey, privateKey, DEFAULT_PAYMENT_OPTIONS);
    await storageService.removeDevice(publicKey);
    this.props.hideModal();
    if (identityService.deviceAddress === publicKey) {
      emitter.emit('setView', 'Login');
    } else {
      emitter.emit('setView', 'MainScreen'); // Switching from main screen to account forces a reload of the component
      emitter.emit('setView', 'Account');
    }
  }

  render() {
    return (
      <DevicesModalView removeDevice={this.removeDevice.bind(this)} hideModal={this.props.hideModal.bind(this)} />
    );
  }
}

DevicesModal.propTypes = {
  hideModal: PropTypes.func,
  publicKey: PropTypes.string,
  services: PropTypes.object
};

export default DevicesModal;
