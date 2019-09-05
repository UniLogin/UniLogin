import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
import {DEFAULT_GAS_PRICE, ApplicationWallet} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalType, ReactModalProps} from '../../core/models/ReactModalContext';
import {createModalService} from '../../core/services/createModalService';
interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService?: WalletService;
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
  modalClassName?: string;
}

export const Onboarding = ({sdk, walletService: injectedWalletService, onConnect, onCreate, domains, className, modalClassName}: OnboardingProps) => {
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const [walletService] = useState(injectedWalletService || new WalletService(sdk));
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
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    walletService.setDeployed(ensName);
    modalService.hideModal();
    onCreate && onCreate(walletService.applicationWallet as ApplicationWallet);
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
