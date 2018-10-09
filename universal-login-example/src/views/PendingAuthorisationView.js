import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PendingAuthorisationView extends Component {
  render() {
    return (
      <div>
        <p className="pending-authorizations-text" key={this.props.authorisation.key}>
          Have you requested to log into this app from a{' '}
          <span className="bold">{this.props.authorisation.label.name}</span> browser
          <span className="bold">{this.props.authorisation.label.os}</span>, from the IP{' '}
          {this.props.authorisation.label.ipAddress} ({this.props.authorisation.label.city}) at{' '}
          <span className="bold">{this.props.authorisation.label.time}</span>, from this
          address <span className="bold">{this.props.authorisation.key} </span>
        </p>
        <button
          className="btn-alt fullwidth"
          onClick={() => this.props.onAcceptClick(this.props.authorisation)}
        >
          ACCEPT REQUEST <br />
          <span className="click-cost">costs 1 click</span>
        </button>
        <button
          className="btn fullwidth"
          onClick={() => this.props.onDenyClick(this.props.authorisation.key)}
        >
          Deny request
        </button>
      </div>
    );
  }
}

PendingAuthorisationView.propTypes = {
  authorisation: PropTypes.object,
  onAcceptClick: PropTypes.func,
  onDenyClick: PropTypes.func
};

export default PendingAuthorisationView;