import React, {useEffect} from 'react';
import {Redirect} from 'react-router';
import {useServices} from '../../hooks';
import {ModalWrapper, TopUp, useProperty, WaitingForDeployment} from '@universal-login/react';
import {CreationSuccess} from '../Modals/ModalTxnSuccess';
import {useHistory} from 'react-router';

export function CreateFlow() {
  const {sdk, walletService, walletCreationService} = useServices();
  const history = useHistory();

  useEffect(() => {
    walletCreationService.deployWhenReady().catch(console.error);
  }, []);

  const walletState = useProperty(walletService.stateProperty);
  switch (walletState.kind) {
    case 'Future':
      return (
        <div className="main-bg">
          <TopUp
            sdk={sdk}
            contractAddress={walletState.wallet.contractAddress}
            isDeployment
            isModal
            onGasParametersChanged={(gasParameters) => walletCreationService.setGasParameters(gasParameters)}
            hideModal={() => {
              walletService.disconnect();
              history.push('/selectDeployName');
            }}
            modalClassName="topup-modal-wrapper"
            topUpClassName="jarvis-styles"
            logoColor="black"
          />
        </div>
      );
    case 'Deploying':
      return (
        <div className="main-bg">
          <ModalWrapper modalClassName="jarvis-modal">
            <WaitingForDeployment
              transactionHash={walletState.transactionHash}
              relayerConfig={sdk.getRelayerConfig()}
              className="jarvis-styles"
            />
          </ModalWrapper>
        </div>
      );
    case 'Deployed':
      return (
        <CreationSuccess />
      );
    default:
      return <Redirect to="/" />;
  }
}
