import ApproveConnectionView from '../views/ApproveConnectionView';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ApproveConnection extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.identityService = this.props.services.identityService;
  }

  onCancelClick() {
    const {emitter} = this.props.services;
    emitter.emit('setView', 'Login');
    this.identityService.cancelSubscription();
  }

  render() {
    return (<ApproveConnectionView
      onCancelClick={this.onCancelClick.bind(this)}
      identity= {this.identityService.identity}
    />);
  }
}

ApproveConnection.propTypes = {
  services: PropTypes.object
};

export default ApproveConnection;
