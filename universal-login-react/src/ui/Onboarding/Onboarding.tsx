import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService, FutureWallet} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
import {DEFAULT_GAS_PRICE, ApplicationWallet, GasParameters, INITIAL_GAS_PARAMETERS} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalType, ReactModalProps, TopUpProps} from '../../core/models/ReactModalContext';
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

export const Onboarding = ({sdk, walletService: injectedWalletService, onConnect, onCreate, domains, tryEnablingMetamask, className, modalClassName}: OnboardingProps) => {
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const [walletService] = useState<OnboardingWalletService>(injectedWalletService || new WalletService(sdk));
  const onConnectClick = () => {
    onConnect && onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    let gasParameters = INITIAL_GAS_PARAMETERS;
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    const topUpProps: TopUpProps = {
      contractAddress,
      sdk,
      onGasParametersChanged: (parameters: GasParameters) => { gasParameters = parameters; },
    };
    modalService.showModal('topUpAccount', topUpProps);
    await waitForBalance();
    modalService.showModal('waitingForDeploy');
    const wallet = await deploy(ensName, DEFAULT_GAS_PRICE.toString(), gasParameters.gasToken);
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
            tryEnablingMetamask={tryEnablingMetamask}
          />
          <Modals modalClassName={modalClassName}/>
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
