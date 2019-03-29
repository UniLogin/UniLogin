import React, {Component} from 'react';
import CreatingIdView from '../views/CreatingIdView';
import PropTypes from 'prop-types';

class CreatingId extends Component {
  render() {
    const {walletContract} = this.props.walletContractService;
    return (<CreatingIdView walletContractName={walletContract.name}/>);
  }
}
CreatingId.propTypes = {
  walletContractService: PropTypes.object
};

export default CreatingId;
