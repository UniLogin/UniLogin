import ApproveConnectionView from '../views/ApproveConnectionView';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ApproveConnection extends Component {

  onCancelClick() {
    const {emitter} = this.props.services;
    emitter.emit('setView', 'Login');  
  }

  render() {
    const {identityService} = this.props.services;
    return (<ApproveConnectionView onCancelClick={this.onCancelClick.bind(this)} identity= {identityService.identity}/>);
  }
}

ApproveConnection.propTypes = {
  services: PropTypes.object
};

export default ApproveConnection;
