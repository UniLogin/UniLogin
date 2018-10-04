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
      publicKeys: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.generateBackupCodes();
  }

  async generateBackupCodes() {
    this.setState({isLoading: true});
    const {identityService} = this.props.services;
    var backupCodes = this.state.backupCodes.slice(0);
    var publicKeys = this.state.publicKeys.slice(0);
    for (var i = 0; i < 3; i++) {
      var backupCode = 
        toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
          .replace(/\s/g, '-')
          .toLowerCase() +
          '-' +
          toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
            .replace(/\s/g, '-')
            .toLowerCase();
      var wallet = await ethers.Wallet.fromBrainWallet(identityService.identity.name, backupCode);
      publicKeys.push(wallet.address);
      backupCodes.push(backupCode);
      this.setState({backupCodes: backupCodes, publicKeys: publicKeys});
    }
    this.setState({isLoading: false});
  }

  async setBackupCodes() {
    const {identityService, emitter, sdk} = this.props.services;
    await sdk.addKeys(identityService.identity.address, this.state.publicKeys, identityService.identity.privateKey, DEFAULT_PAYMENT_OPTIONS);
    emitter.emit('setView', 'Account');
  }

  render() {
    const { identity } = this.props.services.identityService;
    return (
      <BackupView
        isLoading={this.state.isLoading}
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
