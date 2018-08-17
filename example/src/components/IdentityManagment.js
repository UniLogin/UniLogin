import React, { Component } from 'react';
import HeaderView from '../views/HeaderView';
import BackToAppBtn from './BackToAppBtn';
import ProfileIdentity from './ProfileIdentity';
import ManageDevicesAccordion from './ManageDevicesAccordion';
import BackupCodeAccordionView from '../views/BackupCodeAccordionView';
import TrustedFriendsAccordionView from '../views/TrustedFriendsAccordionView';
import SettingsAccordion from './SettingsAccordion';
import PropTypes from 'prop-types';

class Account extends Component {
  render() {
    return (
      <div>
        <HeaderView>
          <BackToAppBtn setView={this.props.setView} />
        </HeaderView>
        <div className="container">
          <ProfileIdentity type="identityAccount" />
          <hr className="separator" />
          <ManageDevicesAccordion emitter={this.props.emitter} />
          <hr className="separator" />
          <BackupCodeAccordionView setView={this.props.setView} />
          <hr className="separator" />
          <TrustedFriendsAccordionView setView={this.props.setView} />
          <hr className="separator" />
          <SettingsAccordion />
          <hr className="separator" />
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  setView: PropTypes.func,
  emitter: PropTypes.object
};

export default Account;
