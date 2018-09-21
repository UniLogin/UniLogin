import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TrustedView extends Component {
  render() {
    return (
      <div className="subview">
        <div className="container">
          <h1 className="main-title">TRUSTED FRIENDS</h1>
          <p>
            If you lose other means of recovery, you can ask <span>4</span> out
            of <span>5</span> accounts to recover your account
          </p>
          <ul className="accounts-list">
            <li className="accounts-list-item">
              <input
                className="input"
                type="text"
                placeholder="type an username"
              />
              <div className="dropdown">
                <button className="dropdown-btn">universal-id.eth</button>
              </div>
            </li>
            <li className="accounts-list-item">
              <input
                className="input"
                type="text"
                placeholder="type an username"
              />
              <div className="dropdown">
                <button className="dropdown-btn">universal-id.eth</button>
              </div>
            </li>
            <li className="accounts-list-item">
              <input
                className="input"
                type="text"
                placeholder="type an username"
              />
              <div className="dropdown">
                <button className="dropdown-btn">universal-id.eth</button>
              </div>
            </li>
            <li className="accounts-list-item">
              <input
                className="input"
                type="text"
                placeholder="type an username"
              />
              <div className="dropdown">
                <button className="dropdown-btn">universal-id.eth</button>
              </div>
            </li>
            <li className="accounts-list-item">
              <input
                className="input"
                type="text"
                placeholder="type an username"
              />
              <div className="dropdown">
                <button className="dropdown-btn">universal-id.eth</button>
              </div>
            </li>
          </ul>
          <button className="btn fullwidth">Send invites</button>
          <p className="click-cost">
            <i>Costs 1 click</i>
          </p>
          <div className="text-center">
            <button
              onClick={() => this.props.setView('Account')}
              className="cancel-invites-btn"
            >
              Cancel invites
            </button>
          </div>
        </div>
      </div>
    );
  }
}

TrustedView.propTypes = {
  setView: PropTypes.func
};

export default TrustedView;
