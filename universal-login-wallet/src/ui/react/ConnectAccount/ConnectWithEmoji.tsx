import React from 'react';
import {EmojiPanel} from '@universal-login/react';
import {generateCode, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';

export const ConnectWithEmoji = () => (
  <div className="main-bg">
    <div className="box-wrapper">
      <div className="box">
        <div className="box-header">
          <h1 className="box-title">Confirmation</h1>
        </div>
        <div className="box-content connect-emoji-content">
          <div className="connect-emoji-section">
            <img src={vault1x} srcSet={vault2x} alt="avatar" className="connect-emoji-img"/>
            <p className="box-text connect-emoji-text">Thanks, now check another device controling this account and enter the emojis in this order:</p>
            <EmojiPanel code={generateCode(TEST_ACCOUNT_ADDRESS)}/>
            <button className="button-secondary connect-emoji-btn">Deny</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
