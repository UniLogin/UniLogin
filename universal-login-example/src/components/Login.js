import React, { Component } from 'react';
import IdentitySelector from './IdentitySelector';
import PropTypes from 'prop-types';
import publicIP from 'react-native-public-ip';
import {detect} from 'detect-browser';
import iplocation from 'iplocation';
import moment from 'moment';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      identity: ''
    };
    this.identityService = this.props.services.identityService;
    this.sdk = this.props.services.sdk;
  }

  async identityExist(identity) {
    return await this.identityService.identityExist(identity);
  }

  async getLabel() {
    const ipAddress = await publicIP();
    const browser = detect();
    const {city} = await iplocation(ipAddress);
    return {
      ipAddress,
      name: browser.name,
      city,
      time: moment().format('h:mm'),
      os: browser.os,
      version: browser.version
    };
  }

  async onNextClick(identity) {
    const {emitter} = this.props.services;
    if (await this.identityExist(identity)) {
      emitter.emit('setView', 'ApproveConnection');
      const label = await this.getLabel();
      await this.identityService.connect(label);
    } else {
      emitter.emit('setView', 'CreatingID');
      await this.identityService.createIdentity(identity);
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
            onNextClick={this.onNextClick.bind(this)}
            onChange={this.onChange.bind(this)}
            ensDomains={ensDomains}
            identityExist = {this.identityExist.bind(this)}
            identitySelectionService={this.props.services.identitySelectionService}
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
