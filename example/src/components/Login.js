import React, { Component } from 'react';
import IdentitySelector from './IdentitySelector';
import PropTypes from 'prop-types';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      identity: ''
    };
    const {identityService} = this.props.services;
    this.identityService = identityService;
  }

  async identityExist(identity) {    
    return await this.identityService.identityExist(identity);
  }

  async update() {    
    const {emitter} = this.props.services;
    const pendingAuthorisations = await this.props.services.authorisationService.getPendingAuthorisations(this.state.identity.address);
    if (typeof(pendingAuthorisations) !== 'undefined') {
      emitter.emit('setView', 'MainScreen');
    } else {
      setTimeout(this.update.bind(this), 1500);
    }
  }

  async onNextClick() {
    const {emitter} = this.props.services;
    const {authorisationService} = this.props.services;
    if (await this.identityExist(this.state.identity)) {
      emitter.emit('setView', 'ApproveConnection');
      await authorisationService.requestAuthorisation(this.identityService.identity.address);
      setTimeout(this.update.bind(this), 3000);
    } else {
      emitter.emit('setView', 'CreatingID');
      await this.identityService.createIdentity(this.state.identity);
      emitter.emit('setView', 'Greeting');
    }
  }

  onChange(identity) {
    this.setState({identity});
  }

  render() {
    const {ensDomains} = this.props.services.config;
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Universal Logins</h1>
          <p className="login-view-text">
            This is an example app for implementing ERC1077&1078 in Ethereum.
            You can use this example to build your own app.
          </p>
          <IdentitySelector
            onNextClick={() => this.onNextClick()}
            onChange={this.onChange.bind(this)}
            ensDomains={ensDomains}
            identityExist = {this.identityExist.bind(this)}
          />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  services: PropTypes.object
};


export default Login;
