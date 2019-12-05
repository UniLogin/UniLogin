import React from 'react';
import {useHistory} from 'react-router';
import {ModalWrapper, useProperty, WaitingForDeployment, useAsyncEffect} from '@universal-login/react';
import {useServices} from '../../hooks';
import {ensure} from '@universal-login/commons';
import {InvalidWalletState} from '@universal-login/sdk';

export function CreateWaiting() {
  const {sdk, walletService} = useServices();
  const history = useHistory();

  useAsyncEffect(() => walletService.waitForTransactionHash()
    .then(() => walletService.waitToBeSuccess())
    .then(() => history.push('/creationSuccess'))
    .catch(console.error), []);

  const walletState = useProperty(walletService.stateProperty);

  if (walletService.state.kind === 'Deployed') {
    return null;
  }

  ensure(walletState.kind === 'Deploying', InvalidWalletState, 'Deploying', walletState.kind);

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
}
