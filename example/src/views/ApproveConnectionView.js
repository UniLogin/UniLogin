import React, { Component } from 'react';

class ApproveConnectionView extends Component {
  render() { 
    return ( 
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Waitting for approval</h1>
          <p className="login-view-text">Open your device that controls this ID and approve this connection.</p>
          <p className="user-id">bobby.universal-id.eth</p>
          <button className="btn fullwidth cancel-btn">Cancel request</button>
        </div>
      </div>
    );
  }
}
 
export default ApproveConnectionView;