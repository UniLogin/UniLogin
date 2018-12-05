import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {filterIP} from '../utils';
import Blockies from 'react-blockies';

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
          <span className="bold">{this.props.authorisation.deviceInfo.browser}</span>{' '}
          browser in{' '}
          <span className="bold">{this.props.authorisation.deviceInfo.name}</span>,
          from the IP{' '}
          <span className="bold">
            {filterIP(this.props.authorisation.deviceInfo.ipAddress)} (
            {this.props.authorisation.deviceInfo.city})
          </span>{' '}
          at <span className="bold">{this.props.authorisation.deviceInfo.time}</span>
          <br />
          <Blockies seed={this.props.authorisation.key.toLowerCase()} size={8} scale={6} />
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
