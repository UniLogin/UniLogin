import React from 'react';
import {WalletSelector} from '@unilogin/react';
import {useWalletConfig, useServices} from '../../hooks';
import {WalletSuggestionAction} from '@unilogin/commons';
import girlWithDocument1x from './../../assets/illustrations/girlWithDocument@1x.png';
import girlWithDocument2x from './../../assets/illustrations/girlWithDocument@2x.png';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router';

interface ConnectSelectorProps {
  setName: (name: string) => void;
}

export const ConnectSelector = ({setName}: ConnectSelectorProps) => {
  const {sdk} = useServices();
  const walletConfig = useWalletConfig();
  const history = useHistory();

  const onConnectClick = async (name: string) => {
    setName(name);
    history.push('/connect/chooseMethod');
  };

  return (
    <>
      <div className="box-header">
        <h1 className="box-title">Connect with another device</h1>
      </div>
      <div className="box-content connect-account-content">
        <img
          src={girlWithDocument1x}
          srcSet={girlWithDocument2x}
          alt="girl with document"
          className="connect-account-img"
        />
        <div className="connect-accoutn-selector-block">
          <label htmlFor="loginInput" className="jarvis-input-label">Type your username</label>
          <WalletSelector
            onConnectClick={onConnectClick}
            sdk={sdk}
            domains={walletConfig.domains}
            actions={[WalletSuggestionAction.connect]}
            placeholder="e.g. satoshi"
          />
          <Link to="/welcome" className="button-secondary connect-account-cancel">Cancel</Link>
        </div>
      </div>
    </>
  );
};
