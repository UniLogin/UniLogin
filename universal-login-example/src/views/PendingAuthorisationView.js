import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PendingAuthorisationView extends Component {
  render() {
    return (
      <div>
        <br />
        <p
          className="pending-authorizations-text"
          key={this.props.authorisation.key}
        >
          Someone requested to log into this app from a{' '}
          <span className="bold">{this.props.authorisation.label.name}</span>{' '}
          browser in{' '}
          <span className="bold">{this.props.authorisation.label.os}</span>,
          from the IP{' '}
          <span className="bold">
            {this.props.authorisation.label.ipAddress} (
            {this.props.authorisation.label.city})
          </span>{' '}
          at <span className="bold">{this.props.authorisation.label.time}</span>
        </p>
        <button
          className="btn-alt fullwidth"
          onClick={() => this.props.onAcceptClick(this.props.authorisation.key)}
        >
          ACCEPT REQUEST <br />
          <span className="click-cost">costs 1 click</span>
        </button>
        <button
          className="btn fullwidth"
          onClick={() => this.props.onDenyClick(this.props.authorisation.key)}
        >
          Deny request
        </button>{' '}
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
