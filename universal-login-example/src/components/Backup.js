import React, { Component } from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';
import {toWords, fromWords} from '../Daefen'
import ethers from 'ethers';


class Backup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backupCodes: []
    };
  }

  componentDidMount() {
  	this.generateBackupCodes();
  }

  generateBackupCodes() {
  	var backupCodes = []
  	var random = Math.floor(Math.random() * Math.pow(2, 55));
  	var backupOne = toWords(random).replace(/\s/g, "-").toLowerCase();
  	random = Math.floor(Math.random() * Math.pow(2, 55));
  	var backupTwo = toWords(random).replace(/\s/g, "-").toLowerCase();
  	random = Math.floor(Math.random() * Math.pow(2, 55));
  	var backupThree = toWords(random).replace(/\s/g, "-").toLowerCase();
  	backupCodes.push(backupOne, backupTwo, backupThree);
  	this.setState({backupCodes: backupCodes})
  }

  setBackupCodes() {
  	console.log("Set Backup -- To be implemented");
  	// TODO: Add backup codes to identity contract
  }

  render() {
  	const {identity} = this.props.identityService;
    return <BackupView identity={identity} setView={this.props.setView} backupCodes={this.state.backupCodes} onGenerateClick={this.generateBackupCodes.bind(this)} onSetBackupClick={this.setBackupCodes.bind(this)} />;
  }
}

Backup.propTypes = {
  setView: PropTypes.func
};

export default Backup;
