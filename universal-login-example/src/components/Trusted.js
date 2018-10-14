import React, {Component} from 'react';
import TrustedView from '../views/TrustedView';
import PropTypes from 'prop-types';

class Trusted extends Component {
  render() {
    return <TrustedView setView={this.props.setView} />;
  }
}

Trusted.propTypes = {
  setView: PropTypes.func
};

export default Trusted;
