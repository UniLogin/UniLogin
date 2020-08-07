import {useProperty} from '../..';
import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {ApplicationWallet} from '@unilogin/commons';
import {useHistory} from 'react-router';
import {OnboardingTopUp} from './OnboardingTopUp';
import {OnboardingWaitForDeployment} from './OnboardingWaitForDeployment';
import {ChooseTopUpToken} from '../TopUp/ChooseTopUpToken';
import {EnterPassword} from './EnterPassword';

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
    : <EnterPassword
      walletService={walletService}
      hideModal={hideModal}
      onConfirm={setPassword}
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
          hideModal={() => history.push('/email')}
          walletService={walletService}
        />
      );
    case 'Future':
      return (
        <OnboardingTopUp
          walletService={walletService}
          hideModal={async () => {
            if (confirm('Are you sure you want to leave? You will lose access to this account.')) {
              walletService.disconnect();
              history.push('/selector');
            }
          }}
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
