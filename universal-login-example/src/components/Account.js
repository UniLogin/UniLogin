import React, { Component } from 'react';
import HeaderView from '../views/HeaderView';
import BackToAppBtn from './BackToAppBtn';
import ProfileIdentity from './ProfileIdentity';
import ManageDevicesAccordion from './ManageDevicesAccordion';
import BackupCodeAccordionView from '../views/BackupCodeAccordionView';
import SettingsAccordion from './SettingsAccordion';
import PropTypes from 'prop-types';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    };
    this.emitter = this.props.services.identityService.emitter;
    this.loadDevices();
  }

  async loadDevices() {
    const {storageService} = this.props.services;
    let devices = await storageService.getDevices();
    if (devices) { this.setState({ devices: devices }); }
  }

  setView(view) {
    this.emitter.emit('setView', view);
  }

  render() {
    return (
      <div className="account">
        <HeaderView>
          <BackToAppBtn setView={this.setView.bind(this)} />
        </HeaderView>

        <div className="container">
          <ProfileIdentity
            type="identityAccount"
            identityService={this.props.services.identityService}
          />
          <hr className="separator" />
          <ManageDevicesAccordion
            emitter={this.props.services.identityService.emitter}
            thisDevice={this.props.services.identityService.deviceAddress}
            devices={this.state.devices}
          />
          <hr className="separator" />
          <BackupCodeAccordionView setView={this.setView.bind(this)} />
          <hr className="separator" />
          <SettingsAccordion />
          <hr className="separator" />
        </div>
      </div>
    );
  }
}
Account.propTypes = {
  services: PropTypes.obj
};

export default Account;
