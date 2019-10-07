import React from 'react';
import {ChooseConnectionMethod} from '@universal-login/react';

interface ChooseConnectionScreenProps {
  onCancel: () => void;
  onConnectWithDeviceClick: () => void;
  onConnectWithPassphraseClick: () => void;
}

export const ChooseConnectionScreen = ({onCancel, onConnectWithDeviceClick, onConnectWithPassphraseClick}: ChooseConnectionScreenProps) => {
  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box">
          <ChooseConnectionMethod
            onConnectWithDeviceClick={onConnectWithDeviceClick}
            onConnectWithPassphraseClick={onConnectWithPassphraseClick}
            onCancel={onCancel}
            className="jarvis-connect"
          />
        </div>
      </div>
    </div>
  );
};
