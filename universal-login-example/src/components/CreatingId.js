import React, {Component} from 'react';
import CreatingIdView from '../views/CreatingIdView';
import PropTypes from 'prop-types';

class CreatingId extends Component {
  render() {
    const {identity} = this.props.walletContractService;
    return (<CreatingIdView walletContractName={identity.name}/>);
  }
}
CreatingId.propTypes = {
  walletContractService: PropTypes.object
};

export default CreatingId;
