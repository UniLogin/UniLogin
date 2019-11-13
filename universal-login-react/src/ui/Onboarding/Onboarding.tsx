import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
import {ApplicationWallet, WalletSuggestionAction} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalProps, ReactModalType} from '../../core/models/ReactModalContext';
import {useModalService} from '../../core/services/useModalService';
import {WalletCreationService} from '../..';
import {OnboardingSteps} from './OnboardingSteps';

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
  modalClassName?: string;
  tryEnablingMetamask?: () => Promise<string | undefined>;
}

export const Onboarding = (props: OnboardingProps) => {
  const modalService = useModalService<ReactModalType, ReactModalProps>();
  const [walletCreationService] = useState(() => new WalletCreationService(props.walletService));

  const onConnectClick = (ensName: string) => {
    const connectionFlowProps = {
      name: ensName,
      sdk: props.sdk,
      walletService: props.walletService,
      onSuccess,
    };
    modalService.showModal('connectionFlow', connectionFlowProps);
  };

  const onSuccess = () => {
    modalService.hideModal();
    props.onConnect && props.onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    walletCreationService.onBalancePresent(() => modalService.hideModal());
    const wallet = await walletCreationService.initiateCreationFlow(ensName);
    modalService.hideModal();
    props.onCreate && props.onCreate(wallet);
  };

  return (
    <div className="universal-login">
      <div className={getStyleForTopLevelComponent(props.className)}>
        <ReactModalContext.Provider value={modalService}>
          <div className="perspective">
            <WalletSelector
              sdk={props.sdk}
              onCreateClick={onCreateClick}
              onConnectClick={onConnectClick}
              domains={props.domains}
              tryEnablingMetamask={props.tryEnablingMetamask}
              actions={[WalletSuggestionAction.connect, WalletSuggestionAction.create]}
            />
          </div>
          <OnboardingSteps
            sdk={props.sdk}
            walletService={props.walletService}
            walletCreationService={walletCreationService}
            modalService={modalService}
          />
          <Modals modalClassName={props.modalClassName} />
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
