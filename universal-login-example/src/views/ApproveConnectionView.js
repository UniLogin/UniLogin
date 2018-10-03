import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ApproveConnectionView extends Component {
  render() { 
    return ( 
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Waiting for approval</h1>
          <p className="login-view-text">Open your device that controls this ID and approve this connection or enter a recovery code and click unlock.</p>
          <p className="user-id">{this.props.identity.name}</p>
          <input className="input login-view-input" type="text" onChange={e => this.props.onChange(e)} placeholder="Enter recovery code."/>
          <button className="btn fullwidth cancel-btn" onClick={this.props.onRecoverClick.bind(this)}>{this.props.btnLabel}</button>
          <button className="btn fullwidth cancel-btn" onClick={this.props.onCancelClick.bind(this)}>Cancel request</button>
        </div>
      </div>
    );
  }
}
 
ApproveConnectionView.propTypes = {
  btnLabel: PropTypes.string,
  onChange: PropTypes.func,
  identity: PropTypes.object,
  onCancelClick: PropTypes.func,
  onRecoverClick: PropTypes.func
};

export default ApproveConnectionView;