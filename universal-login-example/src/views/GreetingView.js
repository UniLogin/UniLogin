import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import {classnames} from '../utils';

function DeviceAdded(props) {
  const classes = classnames({
    animated: props.status === 'fresh',
    'checkmark-ico': true,
    'icon-check': true,
    'order-2': true
  });

  return (<div className="row">
    <span className={classes} />
    <div>
      <strong>You added a new device</strong>
      <p>Received 5 <em>kliks</em></p>
    </div>
  </div>);
}

DeviceAdded.propTypes = {
  status: PropTypes.string
};

function AddNewDevice() {
  return (
    <div className="row">
      <span className="bonus-ico icon-smartphone" />
      <div>
        <strong>Add a second device to increase security</strong>
        <p>You&#39;ll get 5 extra <em>kliks</em></p>
      </div>
    </div>);
}

function AddBackupCode() {
  return (
    <div className="row">
      <span className="icon-printer bonus-ico" />
      <div>
        <strong>Save a backup code</strong>
        <p>
          You&#39;ll get 10 extra <em>kliks</em>
        </p>
      </div>
    </div>
  );
}

function BackupCodeAdded(props) {
  const classes = classnames({
    animated: props.status === 'fresh',
    'checkmark-ico': true,
    'icon-check': true,
    'order-3': true
  });
  return (
    <div className="row">
      <span className={classes} />
      <div>
        <strong>You printed your backup code</strong>
        <p>
          Received 10 <em>kliks</em>
        </p>
      </div>
    </div>);
}

BackupCodeAdded.propTypes = {
  status: PropTypes.string
};

function IdentityCreated(props) {
  const classes = classnames({
    animated: props.status === 'fresh',
    'checkmark-ico': true,
    'icon-check': true
  });
  return (
    <div className="row">
      <span className={classes} />
      <div>
        <strong>You created a new account</strong>
        <p>
          Received 20 <em>kliks</em>
        </p>
      </div>
    </div>
  );
}

IdentityCreated.propTypes = {
  status: PropTypes.string
};

function Header(props) {
  return (
    <div className="row">
      <Blockies seed={props.identity.address.toLowerCase()} size={8} scale={8}/>
      <div>
        <p className="user-id">{props.identity.name}</p>
        <p className="wallet-address">{props.identity.address}</p>
      </div>
    </div>);
}

Header.propTypes = {
  identity: PropTypes.object
};


class GreetingView extends Component {
  render() {
    const {status} = this.props;
    if (status.create) {
      return (
        <div className="greeting-view">
          <div className="container">
            <Header identity={this.props.identity} />
            <hr className="separator" />
            <IdentityCreated status={status.create}/>
            <hr className="separator" />
            {status.addKey !== 'unfinished' ? <DeviceAdded status={status.addKey}/> : <AddNewDevice/>}
            <hr className="separator" />
            {status.backupKeys !== 'unfinished' ? <BackupCodeAdded status={status.backupKeys}/> : <AddBackupCode /> }
            <button className="btn fullwidth start-btn" onClick={this.props.onStartClick.bind(this)}>
              Go to App
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="greeting-view">
        <div className="container">
          <Header identity={this.props.identity} />
          <hr className="separator" />
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
