import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PendingAuthorizationsView extends Component {
  renderEvent(authorisation) {
    return (
      <div>
        <p className="pending-authorizations-text" key={authorisation.key}>
          Have you requested to log into this app from a{' '}
          <span className="bold">{authorisation.label.name}</span> browser
          <span className="bold">{authorisation.label.os}</span>, from the IP{' '}
          {authorisation.label.ipAddress} ({authorisation.label.city}) at{' '}
          <span className="bold">{authorisation.label.time}</span>, from this
          address <span className="bold">{authorisation.key} </span>
        </p>
        <button
          className="btn-alt fullwidth"
          onClick={() => this.props.onAcceptClick(authorisation.key)}
        >
          ACCEPT REQUEST <br />
          <span className="click-cost">costs 1 click</span>
        </button>
        <button
          className="btn fullwidth"
          onClick={() => this.props.onDenyClick(authorisation.key)}
        >
          Deny request
        </button>
      </div>
    );
  }

  render() {
    if (this.props.authorisations.length === 0) {
      return (
        <div className="pending-authorizations">
          <em>There are no pending authorizations at the moment</em>
        </div>
      );
    }
    return (
      <div className="pending-authorizations">
        <h1 className="main-title">Pending Authorizations</h1>
        <div className="container">
          <div className="container">
            {this.props.authorisations.map(this.renderEvent.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}

PendingAuthorizationsView.propTypes = {
  authorisations: PropTypes.array,
  onAcceptClick: PropTypes.func,
  onDenyClick: PropTypes.func
};

export default PendingAuthorizationsView;
