import React, { Component } from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';
import { toWords } from '../Daefen';
import ethers from 'ethers';

class Backup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backupCodes: ['loading...', 'loading...', 'loading...']
    };
  }

  componentDidMount() {
    this.generateBackupCodes();
  }

  generateBackupCodes() {
    var backupCodes = [];

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
    // var wallets = 
    await Promise.all([
      ethers.Wallet.fromBrainWallet(this.props.identityService.identity.name, this.state.backupCodes[0]), 
      ethers.Wallet.fromBrainWallet(this.props.identityService.identity.name, this.state.backupCodes[1]), 
      ethers.Wallet.fromBrainWallet(this.props.identityService.identity.name, this.state.backupCodes[2])
    ]);

    // TODO: Add backup code's keys to identity contract
    // something like....
    // this.props.identityService.addKeys(wallets) 
  }

  render() {
    const { identity } = this.props.identityService;
    return (
      <BackupView
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
  identityService: PropTypes.object,
  setView: PropTypes.func
};

export default Backup;
