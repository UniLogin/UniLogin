import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import {useModal} from '../../core/services/useModal';
import {DEFAULT_GAS_PRICE} from '@universal-login/commons';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: () => void;
  domains: string[];
}

export const Onboarding = ({sdk, onConnect, onCreate, domains}: OnboardingProps) => {
  const modalService = useModal();
  const walletService = new WalletService(sdk);

  const onConnectClick = () => {
    onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance} = await walletService.createFutureWallet();
    console.log(walletService);
    modalService.showModal('topUpAccount');
    await waitForBalance();
    modalService.hideModal();
    modalService.showModal('waitingForDeploy');
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    onCreate();
  };

  return (
    <div>
      <WalletSelector
        sdk={sdk}
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        domains={domains}
      />
      <Modal modalService={modalService} walletService={walletService}/>
    </div>
  );
};
