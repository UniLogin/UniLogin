import React, { Component } from 'react';
import ExampleView from '../views/ExampleView';
import HeaderView from '../views/HeaderView';
import UserInfo from './UserInfo';
import Requests from './Requests';
import LogoutBtn from './LogoutBtn';

class Example extends Component {
  render() {
    return (
      <div>
        <HeaderView>
          <UserInfo />
          <Requests />
          <LogoutBtn />
        </HeaderView>
        <ExampleView />
      </div>
    );
  }
}

export default Example;