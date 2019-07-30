import React, {useState} from 'react';
import InputLabel from '../common/InputLabel';
import {CustomInput} from '../common/CustomInput';

export const ConnectWithPassphrase = () => {
  const [codes, setCodes] = useState('');

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box">
          <div className="box-header">
            <h1 className="box-title">Connect with passphrase</h1>
          </div>
          <div className="box-content connect-passphrase-content">
            <div className="connect-passphrase-section">
              <p className="box-text connect-passphrase-text">Write your 4 words passphrase to recover the access to your account</p>
              <InputLabel htmlFor="">Backup codes</InputLabel>
              <CustomInput
                id="passphrase-input"
                value={codes}
                onChange={event => setCodes(event.target.value)}
              />
              <button className="button-primary connect-passphrase-btn" disabled={!codes}>Deny</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}