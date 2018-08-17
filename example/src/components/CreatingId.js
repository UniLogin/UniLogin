import React, { Component } from 'react';
import CreatingIdView from '../views/CreatingIdView';
import PropTypes from 'prop-types';

class CreatingId extends Component {
  render() {
    return <CreatingIdView setView={this.props.setView} />;
  }
}
CreatingId.propTypes = {
  setView: PropTypes.func
};
export default CreatingId;
