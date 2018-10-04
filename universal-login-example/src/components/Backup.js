import React, { Component } from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';
import { toWords } from '../Daefen';
import ethers from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class Backup extends Component {
  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.sdk = this.props.services.sdk;
    this.state = {
      backupCodes: [],
      btnLabel: 'SET AS BACKUP CODES'
    };
  }

  componentDidMount() {
    this.generateBackupCodes();
  }

  generateBackupCodes() {
    var backupCodes = this.state.backupCodes;
    for (var i = 0; i < 3; i++) {
      backupCodes.push(
        toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
          .replace(/\s/g, '-')
          .toLowerCase() +
          '-' +
          toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
            .replace(/\s/g, '-')
            .toLowerCase()
      );
    }
    this.setState({ backupCodes: backupCodes });
  }

  async setBackupCodes() {
    this.setState({ btnLabel: 'Setting' });
    const {identityService, emitter} = this.props.services;
    const to = identityService.identity.address;
    const {privateKey} = identityService.identity;
    const {sdk} = identityService;
    var publicKeys = [];
    for (var i = 0; i < this.state.backupCodes.length; i++) {
      let wallet = await ethers.Wallet.fromBrainWallet(identityService.identity.name, this.state.backupCodes[i]);
      publicKeys.push(wallet.address);
      this.setState({ btnLabel: this.state.btnLabel + '.' });
    }
    await sdk.addKeys(to, publicKeys, privateKey, DEFAULT_PAYMENT_OPTIONS);
    emitter.emit('setView', 'Account');
  }

  render() {
    const { identity } = this.props.services.identityService;
    return (
      <BackupView
        btnLabel={this.state.btnLabel}
        identity={identity}
        setView={this.props.setView}
        backupCodes={this.state.backupCodes}
        onGenerateClick={this.generateBackupCodes.bind(this)}
        onSetBackupClick={this.setBackupCodes.bind(this)}
      />
    );
  }
}

Backup.propTypes = {
  services: PropTypes.object,
  setView: PropTypes.func
};

export default Backup;
