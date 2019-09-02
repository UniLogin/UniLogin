import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {ConnectionNotification} from '@universal-login/react';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';

interface ConnectionNotificationScreenProps {
  contractAddress: string;
  privateKey: string;
  sdk: UniversalLoginSDK;
}

export const ConnectionNotificationScreen = ({contractAddress, privateKey, sdk}: ConnectionNotificationScreenProps) => (
  <>
    <div className="modal-body">
      <div className="box-header">
        <div className="row align-items-center">
          <h2 className="box-title">Confirmation</h2>
        </div>
      </div>
      <div className="box-content connect-emoji-content">
        <div className="connect-emoji-section">
          <img src={vault1x} srcSet={vault2x} alt="avatar" className="connect-emoji-img" />
          <p className="box-text connect-emoji-text">Thanks, now check another device controling this account and enter the emojis in this order:</p>
          <ConnectionNotification
            contractAddress={contractAddress}
            privateKey={privateKey}
            sdk={sdk}
            className="jarvis-emojis"
          />
        </div>
      </div>
    </div>
  </>
);
