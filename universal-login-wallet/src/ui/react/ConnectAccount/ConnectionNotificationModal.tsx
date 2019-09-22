import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {ConnectionNotification} from '@universal-login/react';

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
