import React, { Component } from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';
import ethers from 'ethers';


class Backup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: ['loading...', 'loading...', 'loading...']
    };
  }

  componentDidMount() {
    this.generateBackupCodes();
  }

  generateBackupCodes() {
    var wallets = [];
    wallets.push(ethers.Wallet.createRandom(), ethers.Wallet.createRandom(), ethers.Wallet.createRandom());
    this.setState({wallets: wallets});
  }

  setBackupCodes() {
    // TODO: Add backup codes to identity contract
  }

  render() {
    const {identity} = this.props.identityService;
    return <BackupView identity={identity} setView={this.props.setView} wallets={this.state.wallets} onGenerateClick={this.generateBackupCodes.bind(this)} onSetBackupClick={this.setBackupCodes.bind(this)} />;
  }
}

Backup.propTypes = {
  identityService: PropTypes.object, 
  setView: PropTypes.func
};

export default Backup;
