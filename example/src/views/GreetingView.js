import React, { Component } from 'react';
import UserIco from '../img/user.svg';
import PropTypes from 'prop-types';

class GreetingView extends Component {
  render() {
    return (
      <div className="greeting-view">
        <div className="container">
          <div className="row">
            <img className="user-avatar" src={UserIco} alt="Avatar" />
            <div>
              <p className="user-id">{this.props.identity.name}</p>
              <p className="wallet-address">{this.props.identity.address}</p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="checkmark-ico icon-check"></span>
            <div>
              <p>You created a new account</p>
              <p>Recieved 10 clicks</p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="bonus-ico icon-smartphone"></span>
            <div>
              <p>Add a second device to increase security</p>
              <p>
                You
                {'\''}
                ll get 5 extra clicks
              </p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="icon-printer bonus-ico"></span>
            <div>
              <p>Save a backup code</p>
              <p>
                You
                {'\''}
                ll get 10 extra clicks
              </p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="icon-users bonus-ico"></span>
            <div>
              <p>Set up 5 trusted friends to recover</p>
              <p>
                You
                {'\''}
                ll get 15 extra clicks
              </p>
            </div>
          </div>
          <button className="btn fullwidth start-btn" onClick={this.props.onStartClick.bind(this)}>
            Start using App
          </button>
        </div>
      </div>
    );
  }
}

GreetingView.propTypes = {
  identity: PropTypes.object,
  onStartClick: PropTypes.func
};

export default GreetingView;
