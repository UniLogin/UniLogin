import React from 'react';
import {Redirect} from 'react-router-dom';
import {ensure} from '@unilogin/commons';
import {InvalidWalletState, WalletState} from '@unilogin/sdk';
import {ModalWrapper, WaitingForDeployment, useAsyncEffect, DEPLOYMENT_DESCRIPTION} from '@unilogin/react';
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
            info={DEPLOYMENT_DESCRIPTION}
          />
        </ModalWrapper>
      </div>
    );
  };
}
