import React from 'react';
import {CompanyLogo} from '../commons/CompanyLogo';
import {useClassFor, classForComponent} from '../utils/classFor';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import '../styles/base/onboardingModal.sass';
import '../styles/themes/UniLogin/onboardingModalThemeUniLogin.sass';
import {ModalWrapperProps, ModalWrapper} from '../Modals/ModalWrapper';

interface OnboardingStepsWrapperProps extends ModalWrapperProps {
  steps?: number;
  progress?: number;
}

export const OnboardingStepsWrapper = ({children, hideModal, message, steps, progress}: OnboardingStepsWrapperProps) =>
  <ModalWrapper hideModal={hideModal} message={message}>
    <div className={useClassFor('onboarding-modal')}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={steps} progress={progress} />
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
          {children}
        </div>
      </div>
    </div>
  </ModalWrapper>;
