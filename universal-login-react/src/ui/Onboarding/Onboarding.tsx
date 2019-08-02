import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import {DEFAULT_GAS_PRICE, ApplicationWallet} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalType} from '../../core/models/ReactModalContext';
import {createModalService} from '../../core/services/createModalService';
interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
}

export const Onboarding = ({sdk, onConnect, onCreate, domains, className}: OnboardingProps) => {
  const modalService = createModalService<ReactModalType>();
  const walletService = new WalletService(sdk);
  const [contractAddress, setContractAddress] = useState<string>('');
  const onConnectClick = () => {
    onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    setContractAddress(contractAddress);
    modalService.showModal('topUpAccount');
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
          <Modal contractAddress={contractAddress}/>
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
