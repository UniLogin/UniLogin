import React, { Component } from 'react';
import UserIco from '../img/user.svg';
import ProfileIdentityAccount from '../views/ProfileIdentityAccount';
import ProfileIdentityHeader from '../views/ProfileIdentityHeader';

class ProfileIdentity extends Component {

  render() {
    switch (this.props.type) {
      case 'identityAccount':
        return <ProfileIdentityAccount
          userIco={UserIco}
          userId='bobby.universal-id.eth'
          address='0xb88b9769721caa916046f7534ce1a5ca1285c7eb'
        />
        break;
        
      case 'identityHeader':
        return <ProfileIdentityHeader
          userIco={UserIco}
          userId='bobby.universal-id.eth'
          address='0xb88b9769721caa916046f7534ce1a5ca1285c7eb'
        />
        break;

      default:
        break;
    }
  }
}

export default ProfileIdentity;