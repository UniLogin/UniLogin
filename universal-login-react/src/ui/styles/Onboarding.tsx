import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService, FutureWallet} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
import {DEFAULT_GAS_PRICE, ApplicationWallet, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalType, ReactModalProps} from '../../core/models/ReactModalContext';
import {createModalService} from '../../core/services/createModalService';

export interface OnboardingWalletService {
  createFutureWallet(): Promise<FutureWallet>;
  setDeployed(ensName: string): void;
}

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService?: OnboardingWalletService;
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
  modalClassName?: string;
}

export const Onboarding = ({sdk, walletService: injectedWalletService, onConnect, onCreate, domains, className, modalClassName}: OnboardingProps) => {
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const [walletService] = useState<OnboardingWalletService>(injectedWalletService || new WalletService(sdk));
  const onConnectClick = () => {
    onConnect && onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    const relayerConfig = await sdk.getRelayerConfig();
    const topUpProps = {
      contractAddress,
      onRampConfig: relayerConfig!.onRampProviders
    };
    modalService.showModal('topUpAccount', topUpProps);
    await waitForBalance();
    modalService.showModal('waitingForDeploy');
    const wallet = await deploy(ensName, DEFAULT_GAS_PRICE.toString(), ETHER_NATIVE_TOKEN.address);
    walletService.setDeployed(ensName);
    modalService.hideModal();
    onCreate && onCreate(wallet);
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
          <Modals modalClassName={modalClassName}/>
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
