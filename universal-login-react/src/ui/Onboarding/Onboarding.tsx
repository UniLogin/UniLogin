import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService, FutureWallet} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import {useModal} from '../../core/services/useModal';
import {DEFAULT_GAS_PRICE} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: () => void;
  domains: string[];
  className?: string;
}

export const Onboarding = ({sdk, onConnect, onCreate, domains, className}: OnboardingProps) => {
  const modalService = useModal();
  const walletService = new WalletService(sdk);
  const [applicationWallet, setApplicationWallet] = useState({} as FutureWallet);

  const onConnectClick = () => {
    onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance} = await walletService.createFutureWallet();
    setApplicationWallet(walletService.applicationWallet! as FutureWallet);
    modalService.showModal('topUpAccount');
    await waitForBalance();
    modalService.hideModal();
    modalService.showModal('waitingForDeploy');
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    modalService.hideModal();
    onCreate();
  };

  return (
    <div className="universal-login">
      <div className={getStyleForTopLevelComponent(className)}>
        <WalletSelector
          sdk={sdk}
          onCreateClick={onCreateClick}
          onConnectClick={onConnectClick}
          domains={domains}
        />
        <Modal modalService={modalService} applicationWallet={applicationWallet}/>
      </div>
    </div>
  );
};
