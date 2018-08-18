import React, { Component } from 'react';
import AppMainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import Requests from './Requests';
import AccountLink from './AccountLink';
import ProfileIdentity from './ProfileIdentity';

class AppMainScreen extends Component {
  
  render() {
    return (
      <div>
        <HeaderView>
          <ProfileIdentity type="identityHeader" />
          <Requests setView={this.props.setView} />
          <AccountLink setView={this.props.setView} />
        </HeaderView>
        <AppMainScreenView />
      </div>
    );
  }
}

export default AppMainScreen;