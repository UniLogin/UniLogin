import React from 'react';
import {WalletSelector} from '@universal-login/react';
import {useWalletConfig, useServices} from '../../hooks';
import {WalletSuggestionAction} from '@universal-login/commons';
import girlWithDocument1x from './../../assets/illustrations/girlWithDocument@1x.png';
import girlWithDocument2x from './../../assets/illustrations/girlWithDocument@2x.png';
import {Link} from 'react-router-dom';
import {ConnectModal} from './ConnectAccount';

interface ConnectSelectorProps {
  setName: (name: string) => void;
  setConnectModal: (modal: ConnectModal) => void;
}

export const ConnectSelector = ({setName, setConnectModal}: ConnectSelectorProps) => {
  const {sdk} = useServices();
  const walletConfig = useWalletConfig();

  const onConnectClick = async (name: string) => {
    setName(name);
    setConnectModal('connectionMethod');
  };

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box">
          <div className="box-header">
            <h1 className="box-title">Connect with another device</h1>
          </div>
          <div className="box-content connect-account-content">
            <img src={girlWithDocument1x} srcSet={girlWithDocument2x} alt="girl with document" className="connect-account-img" />
            <p className="connect-account-info-text">Type your username and approve the connection on another device that controls this account</p>
            <div className="connect-accoutn-selector-block">
              <label htmlFor="loginInput" className="jarvis-input-label">Choose a username</label>
              <WalletSelector
                onCreateClick={() => null}
                onConnectClick={onConnectClick}
                sdk={sdk}
                domains={walletConfig.domains}
                actions={[WalletSuggestionAction.connect]}
                className="jarvis"
              />
              <Link to="/welcome" className="button-secondary connect-account-cancel">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
