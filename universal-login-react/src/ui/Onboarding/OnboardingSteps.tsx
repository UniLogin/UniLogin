import {ModalWrapper, TopUp, useProperty, WaitingForDeployment} from '../..';
import React, {useEffect} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {ApplicationWallet, ensure} from '@universal-login/commons';
import {useHistory} from 'react-router';

interface OnboardingStepsProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onCreate?: (arg: ApplicationWallet) => void;
  className?: string;
}

export function OnboardingSteps({sdk, walletService, className, onCreate}: OnboardingStepsProps) {
  const walletState = useProperty(walletService.stateProperty);

  useEffect(() => {
    ensure(walletState.kind === 'Future', Error, 'Invalid state');
    walletState.wallet.waitForBalance()
      .then(() => walletService.deployFutureWallet())
      .then((wallet) => onCreate?.(wallet));
  }, []);

  const history = useHistory();
  switch (walletState.kind) {
    case 'Future':
      return (
        <TopUp
          modalClassName={className}
          contractAddress={walletState.wallet.contractAddress}
          onGasParametersChanged={(gasParameters) => walletService.setGasParameters(gasParameters)}
          sdk={sdk}
          isDeployment
          hideModal={async () => {
            await walletService.disconnect();
            history.push('/selector');
          }}
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
