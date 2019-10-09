import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modals from '../Modals/Modals';
import {ApplicationWallet, GasParameters, INITIAL_GAS_PARAMETERS, Procedure} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ReactModalContext, ReactModalProps, ReactModalType, TopUpProps} from '../../core/models/ReactModalContext';
import {createModalService} from '../../core/services/createModalService';

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
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const [walletService] = useState<WalletService>(props.walletService || new WalletService(props.sdk));
  const onConnectClick = (ensName: string) => {
    const connectionFlowProps = {
      name: ensName,
      sdk: props.sdk,
      walletService,
      onSuccess
    };
    modalService.showModal('connectionFlow', connectionFlowProps);
  };

  const onSuccess = () => {
    modalService.hideModal();
    props.onConnect && props.onConnect();
  };

  const onCreateClick = async (ensName: string) => {
    let gasParameters = INITIAL_GAS_PARAMETERS;
    const {deploy, waitForBalance, contractAddress, privateKey} = await walletService.createFutureWallet();
    localStorage.setItem('BACKUP_DEMO', JSON.stringify({
      ensName,
      contractAddress,
      privateKey
    }));
    const relayerConfig = await props.sdk.getRelayerConfig();
    const topUpProps: TopUpProps = {
      contractAddress,
      onGasParametersChanged: (parameters: GasParameters) => { gasParameters = parameters; },
      sdk: props.sdk
    };
    modalService.showModal('topUpAccount', topUpProps);
    await waitForBalance();
    modalService.showModal('waitingFor', {
      relayerConfig,
      action: 'Wallet creation',
      transactionHash: '0xee9270ccdeb9fcb92b3ec509ba11ba2362ab32ba8f...'}
    );
    const wallet = await deploy(ensName, gasParameters.gasPrice.toString(), gasParameters.gasToken);
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
          <Modals modalClassName={props.modalClassName} />
        </ReactModalContext.Provider>
      </div>
    </div>
  );
};
