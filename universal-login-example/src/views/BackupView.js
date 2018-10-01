import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

class BackupView extends Component {
  render() {
    return (
      <div className="subview">
        <div className="container">
          <h1 className="main-title">BACKUP CODES</h1>
          <div className="row align-items-center">
            <Blockies 
              seed={this.props.identity.address.toLowerCase()}
              size={8}
              scale={8}
            />
            <div>
              <p className="user-id">{this.props.identity.name}</p>
              <p className="wallet-address">
                {this.props.identity.address}
              </p>
            </div>
          </div>
          <p className="backup-text">
            Keep this codes somewhere safe and secret. Also, don
            {'\''}t forget your username as it
            {'\''}s required to recover access. These are independent codes, use
            each one once. Keep offline and away from computers.
          </p>
          <hr className="separator-s" />
          <p className="backup-code bold">{this.props.backupCodes[0]}</p>
          <hr className="separator-s" />
          <p className="backup-code bold">{this.props.backupCodes[1]}</p>
          <hr className="separator-s" />
          <p className="backup-code bold">{this.props.backupCodes[2]}</p>
          <hr className="separator-s" />
          <button 
            className="generate-code-btn"
            onClick={this.props.onGenerateClick.bind(this)}
          >
            Generate 3 more codes
          </button>
          <button 
            className="btn fullwidth"
            onClick={this.props.onSetBackupClick.bind(this)}
          >
            SET AS BACKUP CODE
          </button>
          <p className="click-cost">
            <i>Costs 2 clicks</i>
          </p>
          <div className="text-center">
            <button
              onClick={() => this.props.setView('Account')}
              className="cancel-backup-btn"
            >
              Cancel backup code
            </button>
          </div>
        </div>
      </div>
    );
  }
}

BackupView.propTypes = {
  onSetBackupClick: PropTypes.func,
  onGenerateClick: PropTypes.func,
  backupCodes: PropTypes.object,
  identity: PropTypes.object,
  setView: PropTypes.type
};

export default BackupView;
