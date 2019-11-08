import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
import {ApplicationWallet, WalletSuggestionAction} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalProps, ReactModalType} from '../../core/models/ReactModalContext';
import {useModalService} from '../../core/services/useModalService';
import {ModalWrapper, TopUp, useProperty, WaitingForDeployment, WalletCreationService} from '../..';

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService?: WalletService;
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
  modalClassName?: string;
  tryEnablingMetamask?: () => Promise<string | undefined>;
}

export const Onboarding = (props: OnboardingProps) => {
  const modalService = useModalService<ReactModalType, ReactModalProps>();
  const [walletService] = useState<WalletService>(props.walletService || new WalletService(props.sdk));
  const [walletCreationService] = useState(() => new WalletCreationService(walletService));

  const onConnectClick = (ensName: string) => {
    const connectionFlowProps = {
      name: ensName,
      sdk: props.sdk,
      walletService,
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

  const walletState = useProperty(walletService.stateProperty);
  const transactionHash = useProperty(walletCreationService.deploymentTransactionHash);
  const renderModal = () => {
    switch (walletState.kind) {
      case 'Future':
        return (
          <TopUp
            modalClassName={props.modalClassName}
            showModal={modalService.showModal}
            contractAddress={walletState.wallet.contractAddress}
            onGasParametersChanged={(gasParameters) => walletCreationService.setGasParameters(gasParameters)}
            sdk={props.sdk}
            isDeployment
            hideModal={() => {
              walletService.disconnect();
              modalService.hideModal();
            }}
            isModal
          />
        );
      case 'Deploying':
        return (
          <ModalWrapper>
            <WaitingForDeployment
              relayerConfig={props.sdk.getRelayerConfig()}
              transactionHash={transactionHash}
            />
          </ModalWrapper>
        );
      default:
        return null;
    }
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
          {renderModal()}
          <Modals modalClassName={props.modalClassName} />
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
