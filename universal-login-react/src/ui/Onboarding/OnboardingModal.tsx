import React from 'react';
import {Onboarding, OnboardingProps} from './Onboarding';
import {CompanyLogo} from '../commons/CompanyLogo';
import {useClassFor, classForComponent} from '../utils/classFor';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import '../styles/base/onboardingModal.sass';
import '../styles/themes/UniLogin/onboardingModalThemeUniLogin.sass';

export function OnboardingModal(props: OnboardingProps) {
  return (
    <div className={useClassFor('onboarding-modal')}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar progress={100}/>
      </div>
      <div className={classForComponent('onboarding-modal-wrapper')}>
        <h1 className={classForComponent('onboarding-modal-title')}>
          Create or connect account
        </h1>
        <p className={classForComponent('onboarding-modal-description')}>
          Type a nickname to create account or your current username to login.
        </p>
        <div className={classForComponent('onboarding-modal-input-section')}>
          <p className={classForComponent('onboarding-modal-label')}>Your nickname:</p>
          <Onboarding {...props} />
        </div>
      </div>
    </div>
  );
}
