import React, {useState} from 'react';
import {useHistory} from 'react-router';
import {ApplicationWallet} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {useProperty} from '../..';
import {OnboardingTopUp} from './OnboardingTopUp';
import {OnboardingWaitForDeployment} from './OnboardingWaitForDeployment';
import {ChooseTopUpToken} from '../TopUp/ChooseTopUpToken';
import {CreatePassword} from './CreatePassword';
import {confirmDisconnect} from '../../app/confirmDisconnect';

interface OnboardingStepsProps {
  walletService: WalletService;
  onCreate?: (arg: ApplicationWallet) => void;
  ensName: string;
}

interface CreateFutureWalletProps {
  walletService: WalletService;
  hideModal?: () => void;
}

const CreateFutureWallet = ({walletService, hideModal}: CreateFutureWalletProps) => {
  const [password, setPassword] = useState('');
  return password
    ? <ChooseTopUpToken
      supportedTokens={['ETH', 'DAI']}
      onClick={async (tokenAddress: string) => {
        await walletService.createFutureWalletWithPassword(password, tokenAddress);
      }}
      hideModal={hideModal}
      walletService={walletService}
    />
    : <CreatePassword
      walletService={walletService}
      hideModal={hideModal}
      onConfirm={(password) => {
        if (walletService.sdk.isRefundPaid()) {
          walletService.createDeployingWalletWithPassword(password);
        } else {
          setPassword(password);
        }
      }}
    />;
};

export function OnboardingSteps({walletService, onCreate, ensName}: OnboardingStepsProps) {
  const walletState = useProperty(walletService.stateProperty);
  const history = useHistory();

  switch (walletState.kind) {
    case 'None':
      return <ChooseTopUpToken
        supportedTokens={['ETH', 'DAI']}
        onClick={async (tokenAddress: string) => {
          await walletService.createFutureWallet(ensName, tokenAddress);
        }}
        hideModal={() => history.push('/selector')}
        walletService={walletService}
      />;
    case 'Confirmed':
      return (
        <CreateFutureWallet
          hideModal={() => confirmDisconnect(walletService, () => history.push('/email'))}
          walletService={walletService}
        />
      );
    case 'Future':
      return (
        <OnboardingTopUp
          walletService={walletService}
          hideModal={() => confirmDisconnect(walletService, () => history.push('/'))}
          isModal
        />
      );
    case 'Deploying':
      return (
        <OnboardingWaitForDeployment
          walletService={walletService}
          onSuccess={onCreate}
          relayerConfig={walletService.sdk.getRelayerConfig()}
          transactionHash={walletState.transactionHash}
        />
      );
    default:
      return null;
  }
}
