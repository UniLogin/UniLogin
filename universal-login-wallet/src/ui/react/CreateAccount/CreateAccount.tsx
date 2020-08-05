import React, {useState} from 'react';
import vaultImage from './../../assets/illustrations/vault.png';
import vaultImage2x from './../../assets/illustrations/vault@2x.png';
import {useServices, useWalletConfig} from '../../hooks';
import {WalletSelector, ChooseTopUpToken} from '@unilogin/react';
import {WalletSuggestionAction} from '@unilogin/commons';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router';

export const CreateAccount = () => {
  const {sdk, walletService} = useServices();
  const walletConfig = useWalletConfig();
  const history = useHistory();
  const [ensName, setEnsName] = useState('');

  const onEnsNameChosen = async (ensName: string) => {
    if (walletService.sdk.isRefundPaid()) {
      await walletService.createDeployingWallet(ensName);
      history.push('/create/topUp');
    } else {
      setEnsName(ensName);
    }
  };

  const onTokenChosen = async (token: string) => {
    await walletService.createFutureWallet(ensName, token);
    history.push('/create/topUp');
  };

  if (!ensName) {
    return (
      <div className="main-bg">
        <div className="box-wrapper">
          <div className="box create-account-box">
            <div className="box-header">
              <h1 className="box-title">Create account</h1>
            </div>
            <div className="box-content create-account-content">
              <img src={vaultImage} srcSet={vaultImage2x} alt="vault" className="create-account-img" />
              <div className="create-account-selector-block">
                <label htmlFor="loginInput" className="jarvis-input-label">Choose a username</label>
                <WalletSelector
                  onCreateClick={onEnsNameChosen}
                  sdk={sdk}
                  domains={walletConfig.domains}
                  actions={[WalletSuggestionAction.create]}
                  placeholder="bob"
                />
              </div>
              <p className="info-text create-account-info-text">
                Your username is a human-readable address.
                Like Domain Name Service (DNS) allows website address to be facebook.com and not 66.220.144.0.,
                Ethereum Name Service (ENS) enables your address to be johndole.xyz., and not 0xeefc..0843.
              </p>
              <Link to="/welcome" className="button-secondary create-account-cancel">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="main-bg">
        <ChooseTopUpToken
          supportedTokens={['ETH', 'DAI']}
          onClick={onTokenChosen}
          walletService={walletService}
          hideModal={() => history.replace('/welcome')}
        />
      </div>
    );
  }
};
