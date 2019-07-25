import React from 'react';
import vaultImage from './../../assets/illustrations/vault.png';
import vaultImage2x from './../../assets/illustrations/vault@2x.png';
import { useServices, useWalletConfig } from '../../hooks';
import {WalletSelector, ModalWrapper, TopUpChooseModal} from '@universal-login/react';
import {WalletSuggestionAction} from '@universal-login/commons';

export const CreateAccount = () => {
  const {sdk} = useServices();
  const walletConfig = useWalletConfig();

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box create-account-box">
          <div className="box-header">
            <h1 className="box-title">Create account</h1>
          </div>
          <div className="create-account-content">
            <img src={vaultImage} srcSet={vaultImage2x} alt="vault" className="create-account-img"/>
            <div className="create-accoutn-selector-block">
              <label htmlFor="loginInput" className="jarvis-input-label">Choose a username</label>
              <WalletSelector
                onCreateClick={() => console.log('create')}
                onConnectionClick={() => null}
                sdk={sdk}
                domains={walletConfig.domains}
                actions={[WalletSuggestionAction.create]}
                className="jarvis"
              />
              <ModalWrapper isVisible={false} modalPosition="bottom">
                <TopUpChooseModal/>
              </ModalWrapper>
            </div>
            <p className="info-text">Your username is a human-readable address. Like Domain Name Service (DNS) allows website address to be facebook.com and not 66.220.144.0., Ethereum Name Service (ENS) enables your address to be johndole.xyz., and not Oxeefc.. 0843.</p>
            <button className="button-secondary create-account-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
