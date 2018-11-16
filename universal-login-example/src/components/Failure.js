import React, {Component} from 'react';
import FailureView from '../views/FailureView';
import PropTypes from 'prop-types';

class Failure extends Component {
  showLogin() {
    const {emitter} = this.props.services;
    emitter.emit('setView', 'Login');
  }

  render() {
    const {error} = this.props.viewParameters;
    return (
      <FailureView
        errorMessage={error}
        onBackClick={this.showLogin.bind(this)}
      />
    );
  }
}

Failure.propTypes = {
  services: PropTypes.object,
  viewParameters: PropTypes.object
};

export default Failure;
