import React, { Component } from 'react';
import UserIco from '../img/user.svg';
import ProfileIdentityAccount from '../views/ProfileIdentityAccount';
import ProfileIdentityHeader from '../views/ProfileIdentityHeader';
import PropTypes from 'prop-types';

class ProfileIdentity extends Component {
  render() {
    const {identity} = this.props.identityService;
    switch (this.props.type) {
    case 'identityAccount':
      return (
        <ProfileIdentityAccount
          userIco={UserIco}
          userId={identity.name}
          address={identity.address}
        />
      );

    case 'identityHeader':
      return (
        <ProfileIdentityHeader
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

ProfileIdentity.propTypes = {
  type: PropTypes.string,
  identityService: PropTypes.object
};

export default ProfileIdentity;
