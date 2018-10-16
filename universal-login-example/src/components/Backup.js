import React, {Component} from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';
import {tokenContractAddress} from '../../config/config';

class Backup extends Component {
  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.sdk = this.props.services.sdk;
    this.backupService = this.props.services.backupService;
    this.state = {
      backupCodes: [],
      publicKeys: [],
      isLoading: true,
      isSetting: false
    };
  }

  async componentDidMount() {
    this.backupService.clearBackupCodes();
    const [
      backupCodes,
      publicKeys
    ] = await this.backupService.generateBackupCodes(2);

    // TODO: Add beforeUnload warning
    this.setState({backupCodes, publicKeys, isLoading: false});
  }

  async generateBackupCodes() {
    this.setState({isLoading: true});
    const [
      backupCodes,
      publicKeys
    ] = await this.backupService.generateBackupCodes(1);
    this.setState({backupCodes, publicKeys, isLoading: false});
  }

  async printCodes() {
    await window.print();
  }

  async setBackupCodes() {
    this.setState({isSetting: true});

    const {identityService, emitter, sdk} = this.props.services;
    const addKeysPaymentOptions = {
      ...DEFAULT_PAYMENT_OPTIONS,
      gasToken: tokenContractAddress
    };
    await sdk.addKeys(
      identityService.identity.address,
      this.state.publicKeys,
      identityService.identity.privateKey,
      addKeysPaymentOptions
    );
    emitter.emit('setView', 'Greeting', {greetMode: 'backupKeys'});
  }

  async cancelBackup() {
    const {emitter} = this.props.services;
    const message = 'You have NOT saved your backup keys! Proceeding will cancel and render these codes useless';
    if (confirm(message)) {
      // TODO: Remove beforeUnload warning if one was added
      emitter.emit('setView', 'Account');
    }
  }

  render() {
    const {identity} = this.props.services.identityService;
    return (
      <BackupView
        isLoading={this.state.isLoading}
        isSetting={this.state.isSetting}
        identity={identity}
        setView={this.props.setView}
        backupCodes={this.state.backupCodes}
        onGenerateClick={this.generateBackupCodes.bind(this)}
        onPrintClick={this.printCodes.bind(this)}
        onSetBackupClick={this.setBackupCodes.bind(this)}
        onCancelClick={this.cancelBackup.bind(this)}
      />
    );
  }
}

Backup.propTypes = {
  services: PropTypes.object,
  setView: PropTypes.func
};

export default Backup;
