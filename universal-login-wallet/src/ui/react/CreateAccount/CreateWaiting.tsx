import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import {ModalWrapper, useProperty, WaitingForDeployment} from '@universal-login/react';
import {useServices} from '../../hooks';
import {ensure} from '@universal-login/commons';

export function CreateWaiting() {
  const {sdk, walletService} = useServices();
  const history = useHistory();

  useEffect(() => {
    walletService.waitForTransactionHash()
      .then(() => walletService.waitToBeSuccess())
      .then(() => history.push('/creationSuccess'))
      .catch(console.error);
  }, []);

  const walletState = useProperty(walletService.stateProperty);
  ensure(walletState.kind === 'Deploying', Error, 'Invalid state');

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
