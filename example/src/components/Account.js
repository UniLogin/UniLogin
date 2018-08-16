import React, { Component } from 'react';
import HeaderView from '../views/HeaderView';
import BackToAppBtn from './BackToAppBtn';
import AccountView from '../views/AccountView';

class Account extends Component {
  
  render() { 
    return ( 
      <div>
        <HeaderView>
          <BackToAppBtn setView={this.props.setView}/>
        </HeaderView>
        <AccountView
          setView={this.props.setView}
          emitter={this.props.emitter}
        />
      </div>
    );
  }
}
 
export default Account;