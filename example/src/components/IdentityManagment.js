import React, {Component} from 'react';
import HeaderView from '../views/HeaderView';
import BackToAppBtn from './BackToAppBtn';
import Collapsible from './Collapsible';

import ProfileIdentity from './ProfileIdentity';
import ManageDevicesAccordion from './ManageDevicesAccordion';
import BackupCodeAccordionView from '../views/BackupCodeAccordionView';
import TrustedFriendsAccordionView from '../views/TrustedFriendsAccordionView';
import SettingsAccordion from './SettingsAccordion';

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

export default Account;
