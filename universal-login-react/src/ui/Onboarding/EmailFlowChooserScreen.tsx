import React from 'react';
import {EmailFlowChooser} from './EmailFlowChooser';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {WalletService} from '@unilogin/sdk';

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
          onCreateClick={() => console.log('create')}
          onConnectClick={() => console.log('connect')}
        />
      </div>
    </OnboardingStepsWrapper>
  );
};
