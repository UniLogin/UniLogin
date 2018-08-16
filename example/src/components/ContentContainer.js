import React, { Component } from 'react';
import Login from './Login';
import CreatingId from './CreatingId';
import ApproveConnectionView from '../views/ApproveConnectionView';
import GreetingView from '../views/GreetingView';
import Account from './Account';
import MainScreen from './MainScreen';
import PendingAuthorizations from './PendingAuthorizations';
import Backup from './Backup';
import Trusted from './Trusted';
import Example from './Example';

class ContentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Login'
    };
  }

  setView(view) {
    this.setState({ view });
  }
  
  render() { 
    if (this.state.view === 'Login') {
      return <Login setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'CreatingID') {
      return <CreatingId setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'ApproveConnection') {
      return <ApproveConnectionView setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'Greeting') {
      return <GreetingView setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'Account') {
      return <Account
        setView={this.setView.bind(this)}
        emitter={this.props.emitter}
      />
    } else if (this.state.view === 'MainScreen') {
      return <MainScreen setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'PendingAuthorizations') {
      return <PendingAuthorizations setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'Backup') {
      return <Backup setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'Trusted') {
      return <Trusted setView={this.setView.bind(this)}/>
    } else if (this.state.view === 'Example') {
      return <Example setView={this.setView.bind(this)}/>
    } 
  }
}
 
export default ContentContainer;