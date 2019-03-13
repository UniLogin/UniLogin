import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddNewDevice from './Sections/AddNewDevice';
import DeviceAdded from './Sections/DeviceAdded';
import AddBackupCode from './Sections/AddBackupCode';
import Header from './Sections/Header';
import BackupCodeAdded from './Sections/BackupCodeAdded';
import WalletCreated from './Sections/WalletCreated';

class GreetingView extends Component {
  render() {
    return (
      <div className="greeting-view">
        <div className="container">
          <Header identity={this.props.identity} />
          <hr className="separator" />
          <WalletCreated status={this.props.status.create} />
          <hr className="separator" />
          {this.props.status.addKey === 'old' ? (
            <DeviceAdded status={this.props.status.addKey} />
          ) : (
            <AddNewDevice />
          )}
          <hr className="separator" />
          {this.props.status.backupKeys === 'old' ? (
            <BackupCodeAdded status={this.props.status.backupKeys} />
          ) : (
            <AddBackupCode />
          )}
          <button
            className="btn fullwidth start-btn"
            onClick={this.props.onStartClick.bind(this)}
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }
}

GreetingView.propTypes = {
  identity: PropTypes.object,
  status: PropTypes.object,
  onStartClick: PropTypes.func
};

export default GreetingView;
