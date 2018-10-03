import React, { Component } from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';
import { toWords } from '../Daefen';

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

  setBackupCodes() {
    // TODO: Add backup codes to identity contract
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
