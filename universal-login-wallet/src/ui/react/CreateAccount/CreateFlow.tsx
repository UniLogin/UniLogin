import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import {ModalWrapper, TopUp, useProperty, WaitingForDeployment} from '@universal-login/react';
import {useServices} from '../../hooks';

export function CreateFlow() {
  const {sdk, walletService, walletCreationService} = useServices();
  const history = useHistory();

  useEffect(() => {
    walletCreationService.deployWhenReady()
      .then(() => history.push('/creationSucceed'))
      .catch(console.error);
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
    default:
      return null;
  }
}
