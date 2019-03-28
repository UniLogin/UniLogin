import React, {Component} from 'react';
import UserIco from '../img/user.svg';
import ProfileAccount from '../views/ProfileAccount';
import ProfileHeader from '../views/ProfileHeader';
import PropTypes from 'prop-types';

class Profile extends Component {
  render() {
    const {identity} = this.props.walletContractService;
    if (!identity.address) {
      return (<div/>);
    }
    switch (this.props.type) {
      case 'identityAccount':
        return (
          <ProfileAccount
            userIco={UserIco}
            userId={identity.name}
            address={identity.address}
          />
        );

      case 'identityHeader':
        return (
          <ProfileHeader
            userIco={UserIco}
            userId={identity.name}
            address={identity.address}
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
