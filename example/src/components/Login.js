import React, { Component } from 'react';
import LoginView from '../views/LoginView';

class Login extends Component {
  render() { 
    return ( 
      <LoginView setView={this.props.setView}/>
     );
  }
}
 
export default Login;