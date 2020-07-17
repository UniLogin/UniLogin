import React from 'react';
import {CompanyLogo} from '../commons/CompanyLogo';
import {useClassFor, classForComponent} from '../utils/classFor';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import '../styles/base/onboardingModal.sass';
import '../styles/themes/UniLogin/onboardingModalThemeUniLogin.sass';
import {ModalWrapperProps, ModalWrapper} from '../Modals/ModalWrapper';

interface OnboardingStepsWrapperNewProps extends ModalWrapperProps {
  steps?: number;
  progress?: number;
}

export const OnboardingStepsWrapperNew = ({children, hideModal, message, steps, progress}: OnboardingStepsWrapperNewProps) =>
  <ModalWrapper hideModal={hideModal} message={message}>
    <div className={useClassFor('onboarding-modal')}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={steps} progress={progress} />
      </div>
      <div className={classForComponent('onboarding-modal-wrapper new')}>
        <h1 className={classForComponent('onboarding-modal-title')}>
          Create or connect account
        </h1>
        <div className={classForComponent('onboarding-modal-content')}>
          {children}
        </div>
      </div>
    </div>
  </ModalWrapper>;
