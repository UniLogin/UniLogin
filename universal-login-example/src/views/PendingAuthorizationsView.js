import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PendingAuthorizationsView extends Component {

  renderEvent(authorisation) {
    return (<div>
      <p className="pending-authorizations-text" key={authorisation.key}>Have you requested to log from this address <span className="bold">{authorisation.key}</span> this {authorisation.label}</p>
      <button className="btn-alt fullwidth" onClick={() => this.props.onAcceptClick(authorisation.key)}>ACCEPT REQUEST <br/><span className="click-cost">costs 1 click</span></button>
      <button className="btn fullwidth">Deny request</button>
    </div>);
  }

  render() {
    if (this.props.authorisations.length === 0) {
      return (
        <div className="pending-authorizations">
          <h1 className="main-title">No pending authorizations</h1>
        </div>
      );
    }
    return (
      <div className="pending-authorizations">
        <h1 className="main-title">Pending Authorizations</h1>
        <div className="container">
          <div className="container">
            { this.props.authorisations.map(this.renderEvent.bind(this)) }
          </div>
        </div>
      </div>
    );
  }
}

PendingAuthorizationsView.propTypes = {
  authorisations: PropTypes.array,
  onAcceptClick: PropTypes.func
};

export default PendingAuthorizationsView;