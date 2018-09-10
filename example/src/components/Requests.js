import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: 0
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  async update() {
    this.pendingAuthorisations = await this.props.authorisationService.getPendingAuthorisations(this.props.identityService.identity.address);
    if(typeof(this.pendingAuthorisations) === 'undefined') {
      this.setState({requests: 0});
      setTimeout(this.update.bind(this), 1000);
    } else {
      this.setState({requests: this.pendingAuthorisations.length});
      setTimeout(this.update.bind(this), 1000);
    }
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

Request.propTypes = {
  setView: PropTypes.func,
  authorisationService: PropTypes.object,
  identityService: PropTypes.object
};

export default Request;
