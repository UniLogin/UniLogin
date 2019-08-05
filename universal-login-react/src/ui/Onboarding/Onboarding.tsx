import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import {DEFAULT_GAS_PRICE, ApplicationWallet} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalType, ReactModalProps} from '../../core/models/ReactModalContext';
import {createModalService} from '../../core/services/createModalService';
interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
}

export const Onboarding = ({sdk, onConnect, onCreate, domains, className}: OnboardingProps) => {
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const walletService = new WalletService(sdk);
  const onConnectClick = () => {
    onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    const relayerConfig = await sdk.getRelayerConfig();
    modalService.showModal('topUpAccount', {contractAddress, onRampConfig: relayerConfig!.onRampProviders});
    await waitForBalance();
    modalService.showModal('waitingForDeploy');
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    modalService.hideModal();
    onCreate(walletService.applicationWallet as ApplicationWallet);
  };


  return (
    <div className="universal-login">
      <div className={getStyleForTopLevelComponent(className)}>
      <ReactModalContext.Provider value={modalService}>
          <WalletSelector
            sdk={sdk}
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            domains={domains}
          />
          <Modal />
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
