import React, {useEffect} from 'react';
import {ensure} from '@universal-login/commons';
import {InvalidWalletState} from '@universal-login/sdk';
import {TopUp, TopUpProps} from '../TopUp/TopUp';

export function OnboardingTopUp(props: TopUpProps) {
  ensure(props.walletService.state.kind === 'Future', InvalidWalletState, 'Future', props.walletService.state.kind);
  const wallet = props.walletService.state.wallet;

  useEffect(() => {
    wallet.waitForBalance()
      .then(() => props.walletService.initDeploy())
      .catch(console.error);
  }, []);

  return (
    <TopUp {...props} />
  );
}
