import React, {Component} from 'react';
import UserIco from '../img/user.svg';
import ProfileAccount from '../views/ProfileAccount';
import ProfileHeader from '../views/ProfileHeader';
import PropTypes from 'prop-types';

class Profile extends Component {
  render() {
    const {walletContract} = this.props.walletContractService;
    if (!walletContract.address) {
      return (<div/>);
    }
    switch (this.props.type) {
      case 'walletContractAccount':
        return (
          <ProfileAccount
            userIco={UserIco}
            userId={walletContract.name}
            address={walletContract.address}
          />
        );

      case 'walletContractHeader':
        return (
          <ProfileHeader
            userIco={UserIco}
            userId={walletContract.name}
            address={walletContract.address}
          />
        );

      default:
        break;
    }
  }
}

Profile.propTypes = {
  type: PropTypes.string,
  walletContractService: PropTypes.object
};

export default Profile;
