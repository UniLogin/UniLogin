import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {filterIP} from '../utils';
import LoaderView from './common/LoaderView';

class PendingAuthorisationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  onAcceptRequestClick() {
    const {key} = this.props.authorisation;
    const {onAcceptClick} = this.props;
    
    this.setState({isLoading: true});
    onAcceptClick(key);
  }
  
  render() {
    const {isLoading} = this.state;
    const {authorisation, onDenyClick} = this.props;
    
    return (
      <div>
        <br />
        <p
          className="pending-authorizations-text"
          key={authorisation.key}
        >
          Someone requested to log into this app from a{' '}
          <span className="bold">{authorisation.deviceInfo.browser}</span>{' '}
          browser in{' '}
          <span className="bold">{authorisation.deviceInfo.name}</span>,
          from the IP{' '}
          <span className="bold">
            {filterIP(authorisation.deviceInfo.ipAddress)} (
            {authorisation.deviceInfo.city})
          </span>{' '}
          at <span className="bold">{authorisation.deviceInfo.time}</span>
        </p>
        {isLoading && <LoaderView className="pending-authorizations-loader" />}
        <button
          className="btn-alt fullwidth pending-authorizations-btn"
          onClick={() => this.onAcceptRequestClick()}
          disabled={isLoading}
        >
          ACCEPT REQUEST <br />
          <span className="click-cost">costs 1 click</span>
        </button>
        <button
          className="btn fullwidth"
          onClick={() => onDenyClick(authorisation.key)}
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
