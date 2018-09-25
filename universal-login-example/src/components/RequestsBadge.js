import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RequestsBadge extends Component {
  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.authorisationService = this.props.services.authorisationService;
    this.state = { requests: this.authorisationService.pendingAuthorisations.length };
  }

  componentDidMount() {
    const {address} = this.identityService.identity;
    this.authorisationService.subscribe(address, this.onAuthorisationChanged.bind(this));
  }

  componentWillUnmount() {
    //TODO: Unsubscribe
  }

  onAuthorisationChanged(authorisations) {
    this.setState({requests: authorisations.length});
  }

  render() {
    return (
      <button
        onClick={() => this.props.setView('PendingAuthorizations')}
        className="request-notification"
      >
        {this.state.requests}
      </button>
    );
  }
}

RequestsBadge.propTypes = {
  setView: PropTypes.func,
  services: PropTypes.object
};

export default RequestsBadge;
