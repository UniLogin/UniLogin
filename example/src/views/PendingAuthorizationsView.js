import React, { Component } from 'react';

class PendingAuthorizationsView extends Component {
  render() {
    return (
      <div className="pending-authorizations">
        <h1 className="main-title">Pending Authorizations</h1>
        <div className="container">
          <p className="pending-authorizations-text">Have you requested to log into this app from a Chrome Browser in Macbook computer, this morning at 9h45 from IP 123.456.789.0 (Rio de Janeiro)?</p>
          <button className="btn-alt fullwidth">ACCEPT REQUEST <br/><span className="click-cost">costs 1 click</span></button>
          <button className="btn fullwidth">Deny request</button>
        </div>
      </div>
    );
  }
}

export default PendingAuthorizationsView;