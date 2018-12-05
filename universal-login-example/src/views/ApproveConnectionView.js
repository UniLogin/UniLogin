import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Blockies from 'react-blockies';

class ApproveConnectionView extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Waiting for approval</h1>
          <p className="login-view-text">
            Open your device that controls this ID
          </p>
          <p className="user-id">{this.props.identity.name}</p>
          <p className="login-view-text">
            and approve this connection
          </p>
          <Blockies seed={this.props.deviceAddress.toLowerCase()} size={8} scale={6} />
          <button
            className="btn fullwidth cancel-btn"
            onClick={this.props.onCancelClick.bind(this)}
          >
            Cancel request
          </button>
          <button
            onClick={this.props.onAccountRecoveryClick.bind(this)}
            className="secondary-btn"
          >
            Recover from backup
          </button>
        </div>
      </div>
    );
  }
}

ApproveConnectionView.propTypes = {
  identity: PropTypes.object,
  deviceAddress: PropTypes.object,
  onCancelClick: PropTypes.func,
  onAccountRecoveryClick: PropTypes.func
};

export default ApproveConnectionView;
