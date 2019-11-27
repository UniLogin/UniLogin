import {ModalWrapper, TopUp, useProperty, WaitingForDeployment, WalletCreationService} from '../..';
import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';

interface OnboardingStepsProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  walletCreationService: WalletCreationService;
  className?: string;
}

export function OnboardingSteps({sdk, walletService, walletCreationService, className}: OnboardingStepsProps) {
  const walletState = useProperty(walletService.stateProperty);
  switch (walletState.kind) {
    case 'Future':
      return (
        <TopUp
          modalClassName={className}
          contractAddress={walletState.wallet.contractAddress}
          onGasParametersChanged={(gasParameters) => walletCreationService.setGasParameters(gasParameters)}
          sdk={sdk}
          isDeployment
          hideModal={() => walletService.disconnect()}
          isModal
        />
      );
    case 'Deploying':
      return (
        <ModalWrapper>
          <WaitingForDeployment
            relayerConfig={sdk.getRelayerConfig()}
            transactionHash={walletState.transactionHash}
          />
        </ModalWrapper>
      );
    default:
      return null;
  }
}
