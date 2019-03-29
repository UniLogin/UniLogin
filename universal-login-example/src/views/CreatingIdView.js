import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddNewDevice from './Sections/AddNewDevice';
import AddBackupCode from './Sections/AddBackupCode';
import CreatingNewAccount from './Sections/CreatingNewAccount';
import HeaderWaiting from './Sections/HeaderWaiting';

class CreatingIdView extends Component {
  render() {
    return (
      <div className="greeting-view">
        <div className="container">
          <HeaderWaiting walletContractName={this.props.walletContractName}/>
          <hr className="separator" />
          <CreatingNewAccount />
          <hr className="separator" />
          <AddNewDevice />
          <hr className="separator" />
          <AddBackupCode />
        </div>
      </div>
    );
  }
}

CreatingIdView.propTypes = {
  walletContractName: PropTypes.string
};

export default CreatingIdView;
