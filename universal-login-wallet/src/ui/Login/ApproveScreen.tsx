import React from 'react';
import Logo from './../../assets/logo-with-text.svg';
import avatar from './../../assets/avatar.svg';
import devices from './../../assets/devices.svg';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';

const ApproveScreen = () => (
  <div className="start">
    <img src={Logo} alt="Logo" className="start-logo"/>
    <h1 className="start-title">Waiting for approval</h1>
    <p className="start-subtitle">Open your device that controls this ID and approve this connection</p>
    <div className="user-row aprove-screen-user">
      <img src={avatar} alt="user avatar" className="user-img"/>
      <p className="user-id">marek.universalogin.eth</p>
    </div>
    <div className="devices">
      <img src={devices} alt="devices that controls this ID" className="devices-img"/>
      <Spinner className="spinner-desktop" dotClassName="spinner-dot-desktop"/>
      <Spinner className="spinner-tablet" dotClassName="spinner-dot-tablet"/>
      <Spinner className="spinner-mob" dotClassName="spinner-dot-mob"/>
    </div>
    <Link to="/recovery" className="btn btn-primary btn-fullwidth start-link">Recover from backup</Link>
    <Link to="/login"className="btn-text start-link-text">Cancel request</Link>
  </div>
);

export default ApproveScreen;
