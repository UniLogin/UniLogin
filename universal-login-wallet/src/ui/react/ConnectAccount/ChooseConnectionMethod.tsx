import React from 'react';
import {Link} from 'react-router-dom';
import {Procedure} from '@universal-login/commons';
import passwordless1x from './../../assets/illustrations/passwordless@1x.png';
import passwordless2x from './../../assets/illustrations/passwordless@2x.png';
import passphrase1x from './../../assets/illustrations/passphrase@1x.png';
import passphrase2x from './../../assets/illustrations/passphrase@2x.png';
import usbIcon from './../../assets/icons/usb.svg';
import documentIcon from './../../assets/icons/document.svg';
import {useServices, useRouter} from '../../hooks';
import {ConnectModal} from './ConnectAccount';

interface ChooseConnectionMethodProps {
  name: string;
  setConnectModal: (modal: ConnectModal) => void;
}

export const ChooseConnectionMethod = ({name, setConnectModal}: ChooseConnectionMethodProps) => {
  const {connectToWallet} = useServices();
  let unsubscribe: Procedure;
  const {history} = useRouter();
  const onClick = async () => {
    unsubscribe = await connectToWallet(name, () => {
      unsubscribe();
      history.push('/');
    });
  };

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box">
          <div className="box-header">
            <h1 className="box-title">Connect with another device</h1>
          </div>
          <div className="box-content choose-connection-content">
            <div className="choose-connection-row-wrapper">
              <div className="choose-connection-row">
                <div className="connection-method">
                  <img src={passwordless1x} srcSet={passwordless2x} alt="avatar" className="connection-method-img" />
                  <h2 className="connection-method-title">Passwordless</h2>
                  <p className="connection-method-text">Approve the connection with another device that already controls your account.</p>
                  <Link to="/connect-with-emoji" onClick={onClick} className="connection-method-link">
                    <img src={usbIcon} alt="usb" className="connection-method-link-img" />
                    Connect with another device
                </Link>
                </div>
                <div className="connection-method">
                  <img src={passphrase1x} srcSet={passphrase2x} alt="avatar" className="connection-method-img" />
                  <h2 className="connection-method-title">Passphrase</h2>
                  <p className="connection-method-text">If you have lost all your devices, recover the access to your account.</p>
                  <button onClick={() => setConnectModal('recover')} className="connection-method-button">
                    <img src={documentIcon} alt="usb" className="connection-method-link-img" />
                    Connect with passphrase
                </button>
                </div>
              </div>
            </div>
            <div className="choose-connection-btn-wrapper">
              <Link to="/connect" className="button-secondary">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
