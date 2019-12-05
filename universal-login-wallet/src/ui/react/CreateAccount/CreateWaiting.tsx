import React from 'react';
import {ModalWrapper, WaitingForDeployment, useAsyncEffect} from '@universal-login/react';
import {useServices} from '../../hooks';
import {ensure} from '@universal-login/commons';
import {InvalidWalletState, WalletState} from '@universal-login/sdk';
import {useHistory} from 'react-router-dom';

interface CreateWaitingProps {
  walletState: WalletState;
}

export function CreateWaiting({walletState}: CreateWaitingProps) {
  const {sdk, walletService} = useServices();
  const history = useHistory();

  useAsyncEffect(async () => {
    try {
      await walletService.waitForTransactionHash()
      await walletService.waitToBeSuccess()
      await history.push('/creationSuccess')
    } catch (e) {
      console.error(e)
    }
  }, []);

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
