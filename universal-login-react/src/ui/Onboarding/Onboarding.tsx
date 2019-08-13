
import React, { useState } from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
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
  const [contractAddress, setContractAddress] = useState<string>("");

  const onConnectClick = () => {
    onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    const relayerConfig = await sdk.getRelayerConfig();
    const topUpProps = {
      contractAddress,
      onRampConfig: relayerConfig!.onRampProviders
    };
    modalService.showModal('topUpAccount', topUpProps);
    setContractAddress(contractAddress);
        
    await waitForBalance();
    modalService.showModal("waitingForDeploy");
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    walletService.setDeployed(ensName);
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
          <Modals />
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
