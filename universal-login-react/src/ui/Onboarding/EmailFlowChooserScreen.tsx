import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {EmailFlowChooser} from './EmailFlowChooser';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';

interface EmailFlowChooserScreen {
  hideModal: () => void;
  walletService: WalletService;
}

export const EmailFlowChooserScreen = ({hideModal, walletService}: EmailFlowChooserScreen) => {
  return (
    <OnboardingStepsWrapper
      title='Create or connect account'
      className='onboarding-select-flow'
      hideModal={hideModal}
      message={walletService.sdk.getNotice()}
      steps={4}
      progress={1}>
      <div className="perspective">
        <EmailFlowChooser
          onCreateClick={(ensName, email) => console.log('create', {ensName, email})}
          onConnectClick={() => console.log('connect')}
        />
      </div>
    </OnboardingStepsWrapper>
  );
};
