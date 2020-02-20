import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import {ensure} from '@unilogin/commons';
import {TopUp} from '@unilogin/react';
import {useServices} from '../../hooks';
import {InvalidWalletState} from '@unilogin/sdk';

export function CreateTopUp() {
  const {walletService} = useServices();
  const history = useHistory();

  ensure(walletService.state.kind === 'Future', InvalidWalletState, 'Future', walletService.state.kind);
  const wallet = walletService.state.wallet;

  useEffect(() => {
    wallet.waitForBalance()
      .then(() => walletService.initDeploy())
      .then(() => history.push('/create/waiting'))
      .catch(console.error);
  }, []);

  return (
    <div className="main-bg">
      <TopUp
        walletService={walletService}
        isModal
        hideModal={() => {
          walletService.disconnect();
          history.push('/selectDeployName');
        }}
        modalClassName="topup-modal-wrapper"
        logoColor="black"
      />
    </div>
  );
}
