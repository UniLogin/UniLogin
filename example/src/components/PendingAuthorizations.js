import React, { Component } from 'react';
import HeaderView from '../views/HeaderView';
import UserInfo from './UserInfo';
import Requests from './Requests';
import LogoutBtn from './LogoutBtn';
import PendingAuthorizationsView from '../views/PendingAuthorizationsView';
import PropTypes from 'prop-types';

class PendingAuthorizations extends Component {
  render() {
    return (
      <div>
        <HeaderView>
          <UserInfo />
          <Requests setView={this.props.setView} />
          <LogoutBtn setView={this.props.setView} />
        </HeaderView>
        <PendingAuthorizationsView setView={this.props.setView} />
      </div>
    );
  }
}

PendingAuthorizations.propTypes = {
  setView: PropTypes.func
};

export default PendingAuthorizations;
