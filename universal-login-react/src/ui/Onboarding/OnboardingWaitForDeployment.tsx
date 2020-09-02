import React from 'react';
import {ensure} from '@unilogin/commons';
import {InvalidWalletState, WalletService, DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {WaitingForTransactionProps, WaitingForDeployment} from '../commons/WaitingForTransaction';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {useAsyncEffect} from '../hooks/useAsyncEffect';

interface OnboardingWaitForDeploymentProps extends WaitingForTransactionProps {
  walletService: WalletService;
  onSuccess?: (wallet: DeployedWithoutEmailWallet) => void;
}

export function OnboardingWaitForDeployment({walletService, onSuccess}: OnboardingWaitForDeploymentProps) {
  useAsyncEffect(async () => {
    try {
      await walletService.waitForTransactionHash();
      const wallet = await walletService.waitToBeSuccess();
      onSuccess?.(wallet);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const walletState = walletService.state;
  ensure(walletState.kind === 'Deploying', InvalidWalletState, 'Deploying', walletState.kind);

  return (
    <ModalWrapper message={walletService.sdk.getNotice()}>
      <WaitingForDeployment
        relayerConfig={walletService.sdk.getRelayerConfig()}
        transactionHash={walletState.transactionHash}
      />
    </ModalWrapper>
  );
};
