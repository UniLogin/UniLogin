import React, {useState, ChangeEvent} from 'react';
import Logo from './../../assets/logo-with-text.svg';
import InputLabel from '../common/InputLabel';
import {Avatar, Input} from '@universal-login/react';
import { Link } from 'react-router-dom';

const RecoveryScreen = () => {
  const [code, setCode] = useState('');

  return (
    <div className="start">
      <img src={Logo} alt="Logo" className="start-logo"/>
      <h1 className="start-title">Waiting for approval</h1>
      <p className="start-subtitle">Open your device that controls this ID and approve this connection</p>
      <div className="user-row recovery-screen-user">
        <img src={Avatar} alt="user avatar" className="user-img"/>
        <p className="user-id">marek.universalogin.eth</p>
      </div>
      <div className="recovery-screen-input">
        <InputLabel htmlFor="recoveyCode">Enter recovery code</InputLabel>
        <Input
          value={code}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setCode(event.target.value)}
          id="recoveyCode"
          autoFocus
        />
      </div>
      <button className="btn btn-primary btn-fullwidth">Recover account</button>
      <Link to="/login"className="btn-text start-link-text">Cancel request</Link>
    </div>
  );
};


export default RecoveryScreen;
