import React, { Component } from 'react';
import UserIco from '../img/user.svg';
import PropTypes from 'prop-types';

class BackupView extends Component {
  render() {
    return (
      <div className="subview">
        <div className="container">
          <h1 className="main-title">BACKUP CODES</h1>
          <div className="row align-items-center">
            <img className="user-avatar" src={UserIco} alt="Avatar" />
            <div>
              <p className="user-id">bobby.universal-id.eth</p>
              <p className="wallet-address">
                0xcee7a4d8be1c30623adc6185b6cdbcba19fac166
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
          <p className="backup-code bold">bamdaa-ewar-izoisi</p>
          <hr className="separator-s" />
          <p className="backup-code bold">fa-depnob-tobpoo-fug</p>
          <hr className="separator-s" />
          <p className="backup-code bold">atyfud-nyjnua-feipyd</p>
          <hr className="separator-s" />
          <button className="generate-code-btn">Generate 3 more codes</button>
          <button className="btn fullwidth">SET AS BACKUP CODE</button>
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
  setView: PropTypes.type
};

export default BackupView;
