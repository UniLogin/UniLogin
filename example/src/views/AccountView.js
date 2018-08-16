import React, { Component } from 'react';
import Collapsible from '../components/Collapsible';
import PhoneIco from '../img/smartphone.svg';
import BackupIco from '../img/printer.svg';
import GroupIco from '../img/users.svg';
import UserIco from '../img/user.svg';
import InfoIco from '../img/info.svg';
import SettingsIco from '../img/settings.svg';
import DevicesList from '../components/DevicesList';

class AccountView extends Component {
  render() {
    return (
      <div className="container">
        <div className="row align-items-center">
          <img className="user-avatar" src={UserIco} alt="Avatar" />
          <div>
            <p className="user-id">bobby.universal-id.eth</p>
            <p className="wallet-address">
              0xcee7a4d8be1c30623adc6185b6cdbcba19fac166
            </p>
          </div>
          <img className="information-ico" src={InfoIco} alt="Info" />
        </div>
        <hr className="separator" />
        <Collapsible
          title="Manage devices"
          subtitle="You currently have 3 authorized devices"
          icon={PhoneIco}
        >
          <DevicesList emitter={this.props.emitter} />
        </Collapsible>
        <hr className="separator" />
        <Collapsible
          title="Backup code"
          subtitle="You have saved this"
          icon={BackupIco}
        >
          <p className="advice-text">
            If you lose all your devices you may not have other ways to recover
            your account. Generate a recovery code and keep it safe
          </p>
          <button onClick={() => this.props.setView('Backup')} className="btn fullwidth">Generate new code</button>
        </Collapsible>
        <hr className="separator" />
        <Collapsible
          title="Trusted friends recovery"
          subtitle="You have 5 friends configured"
          icon={GroupIco}
        >
          <p className="advice-text">
            If you lose all your means of recovery, you can appoint a number of
            other accounts that, together, are able to recover access to your
            account
          </p>
          <button onClick={() => this.props.setView('Trusted')} className="btn fullwidth">Select new trusted friends</button>
        </Collapsible>
        <hr className="separator" />
        <Collapsible
          title="More settings"
          subtitle="Amount of devices nedeed to make changes"
          icon={SettingsIco}
        >
          <div className="dropdown setting">
            <p>Adding and removing new accounts:</p>
            <button className="dropdown-btn setting-dropdown-btn">2 devices</button>
          </div>
          <div className="dropdown setting">
            <p>Other actions:</p>
            <button className="dropdown-btn setting-dropdown-btn">1 device</button>
          </div>
          <button className="btn fullwidth">Save new settings</button>
          <p className="click-cost">
            <i>Cost 2 click</i>
          </p>
        </Collapsible>
        <hr className="separator" />
      </div>
    );
  }
}

export default AccountView;
