import React, { Component } from 'react';
import GreetingView from '../views/GreetingView';
import PropTypes from 'prop-types';

class Greeting extends Component {
  render() {
    const {identity} = this.props.identityService;
    return (
      <GreetingView identity={identity}/>
    );
  }
}

Greeting.propTypes = {
  identityService: PropTypes.object
};

export default Greeting;