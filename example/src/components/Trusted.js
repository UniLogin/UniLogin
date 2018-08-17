import React, { Component } from 'react';
import TrustedView from '../views/TrustedView';

class Trusted extends Component {
  render() {
    return (
      <TrustedView setView={this.props.setView}/>
    );
  }
}

export default Trusted;
