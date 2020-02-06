import React from 'react';
import {Redirect} from 'react-router-dom';
import {ensure} from '@universal-login/commons';
import {InvalidWalletState, WalletState} from '@universal-login/sdk';
import {ModalWrapper, WaitingForDeployment, useAsyncEffect, WAITING_FOR_TRANSACTION_DESCRIPTION} from '@universal-login/react';
import {useServices} from '../../hooks';

interface CreateWaitingProps {
  walletState: WalletState;
}

export function CreateWaiting({walletState}: CreateWaitingProps) {
  const {sdk, walletService} = useServices();

  useAsyncEffect(async () => {
    try {
      await walletService.waitForTransactionHash();
      await walletService.waitToBeSuccess();
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (walletState.kind === 'Deployed') {
    return <Redirect to="/creationSuccess" />;
  } else {
    ensure(walletState.kind === 'Deploying', InvalidWalletState, 'Deploying', walletState.kind);
    return (
      <div className="main-bg">
        <ModalWrapper modalClassName="jarvis-modal">
          <WaitingForDeployment
            transactionHash={walletState.transactionHash}
            relayerConfig={sdk.getRelayerConfig()}
            className="jarvis-styles"
            info={WAITING_FOR_TRANSACTION_DESCRIPTION}
          />
        </ModalWrapper>
      </div>
    );
  };
}
