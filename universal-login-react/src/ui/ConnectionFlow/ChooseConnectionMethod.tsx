import React, {useRef, useState} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import ScrollProgressDots from '../commons/ScrollProgressDots';
import {calculateScrollProgress} from '../../app/scrollProgress';
import './../styles/connection.sass';
import './../styles/connectionDefault.sass';

interface ChooseConnectionMethodProps {
  onConnectWithDeviceClick: () => void;
  onConnectWithPassphraseClick: () => void;
  onCancel: () => void;
  className?: string;
}

export const ChooseConnectionMethod = ({onCancel, onConnectWithDeviceClick, onConnectWithPassphraseClick, className}: ChooseConnectionMethodProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.0);

  return (
    <div className="universal-login-connection">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="connection">
          <h1 className="connection-title">Connect with another device</h1>
          <div className="connection-content">
            <div className="connection-row-wrapper" ref={ref} onScroll={() => calculateScrollProgress(ref, setProgress)} >
              <div className="connection-row">
                <div className="connection-method passwordless-method">
                  <h2 className="connection-method-title">Passwordless</h2>
                  <p className="connection-method-text">Approve the connection with another device that already controls your account.</p>
                  <button id="emoji" onClick={onConnectWithDeviceClick} className="connection-method-link">
                    <span>Connect with another device</span>
                  </button>
                </div>
                <div className="connection-method passphrase-method">
                  <h2 className="connection-method-title">Passphrase</h2>
                  <p className="connection-method-text">If you have lost all your devices, recover the access to your account.</p>
                  <button id="recover" onClick={onConnectWithPassphraseClick} className="connection-method-link">
                    <span>Connect with passphrase</span>
                  </button>
                </div>
              </div>
            </div>
            <ScrollProgressDots dotOpacities={[1.0 - progress, progress]} minimumOpacity={0.3} maximumOpacity={0.8}/>
            <button onClick={onCancel} className="connection-cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
