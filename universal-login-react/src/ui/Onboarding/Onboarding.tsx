import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import {DEFAULT_GAS_PRICE, ApplicationWallet} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {createModalService} from '../../core/services/useModal';
import {getModalContext} from '../../core/services/useModal';
import {ModalStateType} from '../../core/models/ModalStateType';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
}

export const Onboarding = ({sdk, onConnect, onCreate, domains, className}: OnboardingProps) => {
  const modalService = createModalService<ModalStateType>();
  const walletService = new WalletService(sdk);
  const [contractAddress, setContractAddress] = useState<string>('');
  const ModalContext = getModalContext<ModalStateType>();

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
    <ModalContext.Provider value={modalService}>
      <div className="universal-login">
        <div className={getStyleForTopLevelComponent(className)}>

          <WalletSelector
            sdk={sdk}
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            domains={domains}
          />
          <Modal contractAddress={contractAddress}/>
          <Modal />
        </div>
      </div>
    </ModalContext.Provider>
  );
};
