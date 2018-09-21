import React, { Component } from 'react';
import UserInfoView from '../views/UserInfoView';
import UserAvatar from '../img/user.svg';

class UserInfo extends Component {
  render() {
    return (
      <UserInfoView
        userIco={UserAvatar}
        userId="bobby.universal-id.eth"
        wallet="0xb88b9769721caa916046f7534ce1a5ca1285c7eb"
      />
    );
  }
}

export default UserInfo;
