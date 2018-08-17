import React, { Component } from 'react';
import AppMainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import UserInfo from './UserInfo';
import Requests from './Requests';
import AccountLink from './AccountLink';

class AppMainScreen extends Component {
  
  render() {
    return (
      <div>
        <HeaderView>
          <UserInfo />
          <Requests setView={this.props.setView}/>
          <AccountLink setView={this.props.setView}/>
        </HeaderView>
        <AppMainScreenView />
      </div>
    );
  }
}

export default AppMainScreen;