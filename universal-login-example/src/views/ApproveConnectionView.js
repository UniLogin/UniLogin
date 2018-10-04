import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ApproveConnectionView extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Waiting for approval</h1>
          <p className="login-view-text">
            Open your device that controls this ID and approve this connection
          </p>
          <p className="user-id">{this.props.identity.name}</p>
          <button
            className="btn fullwidth cancel-btn"
            onClick={this.props.onCancelClick.bind(this)}
          >
            Cancel request
          </button>
        </div>
      </div>
    );
  }
}

ApproveConnectionView.propTypes = {
  identity: PropTypes.object,
  onCancelClick: PropTypes.func
};

export default ApproveConnectionView;
