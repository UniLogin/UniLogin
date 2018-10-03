import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

class BackupView extends Component {
  render() {
    return (
      <div className="subview">
        <div className="container">
          <h1 className="main-title">BACKUP CODES</h1>
          <p className="backup-text">
            Print these, cut them apart and keep them safe locations apart from
            each other. Keep them away from computers until you want to use
            them.
          </p>
          <hr className="separator-s" />
          <div className="row align-items-center">
            <Blockies
              seed={this.props.identity.address.toLowerCase()}
              size={8}
              scale={6}
            />
            <p className="backup-code">
              {this.props.identity.name} <br />
              <strong>{this.props.backupCodes[0]}</strong>
            </p>
          </div>
          <hr className="separator-s" />
          <div className="row align-items-center">
            <Blockies
              seed={this.props.identity.address.toLowerCase()}
              size={8}
              scale={6}
            />
            <p className="backup-code">
              {this.props.identity.name} <br />
              <strong>{this.props.backupCodes[1]}</strong>
            </p>
          </div>
          <hr className="separator-s" />
          <div className="row align-items-center">
            <Blockies
              seed={this.props.identity.address.toLowerCase()}
              size={8}
              scale={6}
            />
            <p className="backup-code">
              {this.props.identity.name} <br />
              <strong>{this.props.backupCodes[2]}</strong>
            </p>
          </div>
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
            SET AS BACKUP CODES
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
  backupCodes: PropTypes.array,
  identity: PropTypes.object,
  setView: PropTypes.type
};

export default BackupView;
