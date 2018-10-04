import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RequestsBadge extends Component {
  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.authorisationService = this.props.services.authorisationService;
    this.state = {
      requests: this.authorisationService.pendingAuthorisations.length
    };
  }

  componentDidMount() {
    const { address } = this.identityService.identity;
    this.authorisationService.subscribe(
      address,
      this.onAuthorisationChanged.bind(this)
    );
  }

  componentWillUnmount() {
    //TODO: Unsubscribe
  }

  onAuthorisationChanged(authorisations) {
    this.setState({ requests: authorisations.length });

    // Browser notification
    if (authorisations.length > 0 && 'Notification' in window) {
      const alertMessage =
        'Login requested from ' +
        authorisations[0].label.os +
        ' from ' +
        authorisations[0].label.city;

      // Let's check whether notification permissions have already been granted
      if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        new Notification(alertMessage);
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            new Notification(alertMessage);
          }
        });
      }
    }
  }

  render() {
    return this.state.requests > 0 ? (
      <button
        onClick={() => this.props.setView('PendingAuthorizations')}
        className="request-notification"
      >
        {this.state.requests}
      </button>
    ) : (
      ''
    );
  }
}

RequestsBadge.propTypes = {
  setView: PropTypes.func,
  services: PropTypes.object
};

export default RequestsBadge;
