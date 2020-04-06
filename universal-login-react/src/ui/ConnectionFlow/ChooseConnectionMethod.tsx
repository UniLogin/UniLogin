import React, {useRef, useState} from 'react';
import ScrollProgressDots from '../commons/ScrollProgressDots';
import {calculateScrollProgress} from '../../app/scrollProgress';
import {useClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/chooseConnection.sass';
import './../styles/themes/Legacy/chooseConnectionThemeLegacy.sass';
import './../styles/themes/Jarvis/chooseConnectionThemeJarvis.sass';
import './../styles/themes/UniLogin/chooseConnectionThemeUniLogin.sass';

interface ChooseConnectionMethodProps {
  onConnectWithDeviceClick: () => void;
  onConnectWithPassphraseClick: () => void;
  onCancel: () => void;
}

export const ChooseConnectionMethod = ({onCancel, onConnectWithDeviceClick, onConnectWithPassphraseClick}: ChooseConnectionMethodProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.0);

  return (
    <div className={useClassFor('connection')}>
      <div className={classForComponent('connection-wrapper')}>
        <h1 className={classForComponent('connection-title')}>Connect account</h1>
        <div className={classForComponent('connection-content')}>
          <div className={classForComponent('connection-row-wrapper')} ref={ref} onScroll={() => calculateScrollProgress(ref, setProgress)} >
            <div className={classForComponent('connection-row')}>
              <div className={`${classForComponent('connection-method')} ${useClassFor('passwordless-method')}`}>
                <h2 className={classForComponent('connection-method-title')}>Confirm on device</h2>
                <p className={classForComponent('connection-method-text')}>Approve the connection with another device that already controls your account.</p>
                <button id="emoji" onClick={onConnectWithDeviceClick} className={classForComponent('connection-method-link')}>
                  <span>Connect with another device</span>
                </button>
              </div>
              <div className={`${classForComponent('connection-method')} ${classForComponent('passphrase-method')}`}>
                <h2 className={classForComponent('connection-method-title')}>Recovery code</h2>
                <p className={classForComponent('connection-method-text')}>If you have lost all your devices, recover the access to your account.</p>
                <button id="recover" onClick={onConnectWithPassphraseClick} className={classForComponent('connection-method-link')}>
                  <span>Connect with passphrase</span>
                </button>
              </div>
            </div>
          </div>
          <ScrollProgressDots dotOpacities={[1.0 - progress, progress]} minimumOpacity={0.3} maximumOpacity={0.8}/>
          <button onClick={onCancel} className={classForComponent('connection-cancel-button')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
