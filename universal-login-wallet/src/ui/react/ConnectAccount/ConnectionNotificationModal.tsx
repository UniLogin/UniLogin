import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {ConnectionNotification} from '@universal-login/react';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';

interface ConnectionNotificationModalProps {
  contractAddress: string;
  privateKey: string;
  sdk: UniversalLoginSDK;
}

export const ConnectionNotificationModal = ({contractAddress, privateKey, sdk}: ConnectionNotificationModalProps) => (
  <>
    <div id="notifications" className="modal-body">
      <div className="box-content">
        <ConnectionNotification
          contractAddress={contractAddress}
          privateKey={privateKey}
          sdk={sdk}
          className="jarvis-emojis"
        />
      </div>
    </div>
  </>
);
