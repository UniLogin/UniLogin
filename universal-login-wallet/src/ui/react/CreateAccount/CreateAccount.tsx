import React from 'react';
import vaultImage from './../../assets/illustrations/vault.png';
import vaultImage2x from './../../assets/illustrations/vault@2x.png';
import {useServices, useWalletConfig, useRouter} from '../../hooks';
import {WalletSelector} from '@universal-login/react';
import {WalletSuggestionAction, defaultDeployOptions, DEFAULT_LOCATION} from '@universal-login/commons';
import Modal from '../Modals/Modal';

interface CreateAccountProps {
  location?: {state: {from: {pathname: string}}};
}

export const CreateAccount = ({location}: CreateAccountProps) => {
  const {sdk, modalService, walletService} = useServices();
  const {history} = useRouter();
  const walletConfig = useWalletConfig();
  const from = location && location.state ? location.state.from : DEFAULT_LOCATION;

  const onCreateClick = async (name: string) => {
    const {deploy, waitForBalance} = await walletService.createFutureWallet();
    modalService.showModal('topUpAccount');
    await waitForBalance();
    modalService.showModal('waitingForDeploy');
    await deploy(name, defaultDeployOptions.gasPrice.toString());
    walletService.setDeployed(name);
    history.push(from);
  };

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box create-account-box">
          <div className="box-header">
            <h1 className="box-title">Create account</h1>
          </div>
          <div className="create-account-content">
            <img src={vaultImage} srcSet={vaultImage2x} alt="vault" className="create-account-img" />
            <div className="create-accoutn-selector-block">
              <label htmlFor="loginInput" className="jarvis-input-label">Choose a username</label>
              <WalletSelector
                onCreateClick={onCreateClick}
                onConnectionClick={() => null}
                sdk={sdk}
                domains={walletConfig.domains}
                actions={[WalletSuggestionAction.create]}
                className="jarvis"
              />
            </div>
            <p className="info-text create-account-info-text">Your username is a human-readable address. Like Domain Name Service (DNS) allows website address to be facebook.com and not 66.220.144.0., Ethereum Name Service (ENS) enables your address to be johndole.xyz., and not Oxeefc.. 0843.</p>
            <button className="button-secondary create-account-cancel">Cancel</button>
          </div>
        </div>
      </div>
      <Modal />
    </div>
  );
};
