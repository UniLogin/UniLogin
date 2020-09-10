import React from 'react';
import {CompanyLogo} from '../commons/CompanyLogo';
import {useClassFor, classForComponent} from '../utils/classFor';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import '../styles/base/onboardingModal.sass';
import '../styles/themes/UniLogin/onboardingModalThemeUniLogin.sass';
import '../styles/themes/Jarvis/onboardingModalThemeJarvis.sass';
import {ModalWrapperProps, ModalWrapper} from '../Modals/ModalWrapper';

interface OnboardingStepsWrapperProps extends ModalWrapperProps {
  title?: string;
  description?: string;
  contentLabel?: string;
  className?: string;
  steps?: number;
  progress?: number;
}

export const OnboardingStepsWrapper = ({children, hideModal, message, title, description, contentLabel, className, steps, progress}: OnboardingStepsWrapperProps) =>
  <ModalWrapper hideModal={hideModal} message={message}>
    <div className={`${useClassFor('onboarding-modal')} ${className && classForComponent(className)}`}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={steps} progress={progress} />
      </div>
      <div className={classForComponent('onboarding-modal-wrapper')}>
        {title && <h1 className={classForComponent('onboarding-modal-title')}>{title}</h1>}
        {description && <p className={classForComponent('onboarding-modal-description')}>{description}</p>}
        <div className={classForComponent('onboarding-modal-content')}>
          {contentLabel && <p className={classForComponent('onboarding-modal-label')}>Your nickname:</p>}
          {children}
        </div>
      </div>
    </div>
  </ModalWrapper>;
