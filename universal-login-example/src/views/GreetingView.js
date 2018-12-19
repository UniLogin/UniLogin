import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddNewDevice from './Sections/AddNewDevice';
import DeviceAdded from './Sections/DeviceAdded';
import AddBackupCode from './Sections/AddBackupCode';
import Header from './Sections/Header';
import BackupCodeAdded from './Sections/BackupCodeAdded';
import IdentityCreated from './Sections/IdentityCreated';

class GreetingView extends Component {
  render() {
    return (
      <div className="greeting-view">
        <div className="container">
          <Header identity={this.props.identity} />
          <hr className="separator" />
          <IdentityCreated status={status.create} />
          <hr className="separator" />
          {status.addKey === 'old' ? (
            <DeviceAdded status={status.addKey} />
          ) : (
            <AddNewDevice />
          )}
          <hr className="separator" />
          {status.backupKeys === 'old' ? (
            <BackupCodeAdded status={status.backupKeys} />
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
