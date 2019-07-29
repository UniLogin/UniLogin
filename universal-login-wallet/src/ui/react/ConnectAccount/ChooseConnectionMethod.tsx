import React from 'react';
import {NavigationProps} from '../common/Navigation';
import {Link} from 'react-router-dom';
import passwordless1x from './../../assets/illustrations/passwordless@1x.png';
import passwordless2x from './../../assets/illustrations/passwordless@2x.png';
import passphrase1x from './../../assets/illustrations/passphrase@1x.png';
import passphrase2x from './../../assets/illustrations/passphrase@2x.png';
import usbIcon from './../../assets/icons/usb.svg';

export const ChooseConnectionMethod = ({location}: NavigationProps) => (
  <div className="main-bg">
    <div className="box-wrapper">
      <div className="box">
        <div className="box-header">
          <h1 className="box-title">Connect with another device</h1>
        </div>
        <div className="box-content choose-connection-content">
          <div className="choose-connection-row-wrapper">
            <div className="choose-connection-row">
              <div className="connection-method">
                <img src={passwordless1x} srcSet={passwordless2x} alt="avatar" className="connection-method-img"/>
                <h2 className="connection-method-title">Passwordless</h2>
                <p className="connection-method-text">Approve the connection with another device that slready controls your account.</p>
                <Link to="/" className="connection-method-link">
                  <img src={usbIcon} alt="usb" className="connection-method-link-img"/>
                  Connect with another device
                </Link>
              </div>
              <div className="connection-method">
                <img src={passphrase1x} srcSet={passphrase2x} alt="avatar" className="connection-method-img"/>
                <h2 className="connection-method-title">Passphrase</h2>
                <p className="connection-method-text">If you have lost all your devices, recover the access to your account.</p>
                <Link to="/" className="connection-method-link">
                  <img src={usbIcon} alt="usb" className="connection-method-link-img"/>
                  Connect with another device
                </Link>
              </div>
            </div>
          </div>
          <div className="choose-connection-btn-wrapper">
            <Link to="/connect" className="button-secondary">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
