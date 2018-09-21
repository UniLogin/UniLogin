import React, { Component } from 'react';
import CreatingIdView from '../views/CreatingIdView';
import PropTypes from 'prop-types';

class CreatingId extends Component {
  render() {
    const {identity} = this.props.identityService;
    return (<CreatingIdView identityName={identity.name}/>);
  }
}
CreatingId.propTypes = {
  identityService: PropTypes.object
};

export default CreatingId;
