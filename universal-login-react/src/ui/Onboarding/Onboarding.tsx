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
  tryEnablingMetamask?: () => Promise<string | undefined>;
}

export const Onboarding = (props: OnboardingProps) => {
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const [walletService] = useState<OnboardingWalletService>(props.walletService || new WalletService(props.sdk));
  const onConnectClick = () => {
    props.onConnect && props.onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    const relayerConfig = await props.sdk.getRelayerConfig();
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
            />
          </div>
          <Modals modalClassName={props.modalClassName}/>
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
