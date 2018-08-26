import React, { Component } from 'react';
import AppMainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import Requests from './Requests';
import AccountLink from './AccountLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';

class AppMainScreen extends Component {

  setView(view) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view);
  }

  render() {
    return (
      <div>
        <HeaderView>
          <ProfileIdentity
            type="identityHeader"
            identityService={this.props.services.identityService}/>
          <Requests setView={this.setView.bind(this)} />
          <AccountLink setView={this.setView.bind(this)} />
        </HeaderView>
        <AppMainScreenView />
      </div>
    );
  }
}

AppMainScreen.propTypes = {
  services: PropTypes.object
};

export default AppMainScreen;
