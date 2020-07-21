import React from 'react';
import {EmailFlowChooser} from './EmailFlowChooser';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {OnboardingProps} from './Onboarding';

export const EmailFlowChooserScreen = (props: OnboardingProps) => {
  return (
    <OnboardingStepsWrapper
    title='Create or connect account'
    className='onboarding-select-flow'
    hideModal={props.hideModal}
    message={props.walletService.sdk.getNotice()}
    steps={4}
    progress={1}>
      <div className="perspective">
        <EmailFlowChooser
          onCreateClick={() => console.log('create')}
          onConnectClick={() => console.log('connect')}
        />
      </div>
    </OnboardingStepsWrapper>
  )
}
