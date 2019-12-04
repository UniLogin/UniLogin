import {ModalWrapper, TopUp, useProperty, WaitingForDeployment, WalletCreationService} from '../..';
import React, {useEffect} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {ApplicationWallet} from '@universal-login/commons';

interface OnboardingStepsProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  walletCreationService: WalletCreationService;
  onCreate?: (arg: ApplicationWallet) => void;
  className?: string;
}

export function OnboardingSteps({sdk, walletService, walletCreationService, className, onCreate}: OnboardingStepsProps) {
  useEffect(() => {
    setImmediate(async () => {
      const wallet = await walletCreationService.deployWhenReady();
      onCreate?.(wallet);
    });
  }, []);

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
