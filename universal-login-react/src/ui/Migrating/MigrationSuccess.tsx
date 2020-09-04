import React from 'react';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import {classForComponent, useClassFor} from '../utils/classFor';
import successIcon from '../assets/icons/success.svg';
import '../styles/base/migrationSuccess.sass';
import '../styles/themes/UniLogin/migrationSuccessThemeUniLogin.sass';
import {OnboardingStepsWrapper} from '../Onboarding/OnboardingStepsWrapper';
import {WalletService} from '@unilogin/sdk';

interface MigrationSuccessProps {
  walletService: WalletService;
  onConfirm: () => void;
  hideModal: () => void;
}

export const MigrationSuccess = ({onConfirm, hideModal, walletService}: MigrationSuccessProps) => {
  return <OnboardingStepsWrapper
    title="Migration succeed!"
    className='migration-success'
    hideModal={hideModal}
    steps={4}
    progress={4}
    message={walletService.sdk.getNotice()}
  >
    <div className={useClassFor('migration-success-wrapper')}>
      <div className={classForComponent('migration-success-content')}>
        <div className={`${classForComponent('migration-success-icon-wrapper')} ${'success'}`}>
          <img src={successIcon} alt="success" className={classForComponent('migration-success-icon')} />
        </div>
        <h4 className={classForComponent('migration-success-subtitle')}>Hurray!</h4>
        <p className={classForComponent('migration-success-description')}>Your account is secure now! Use your password to login to your account on other devices.</p>
      </div>
      <div className={classForComponent('buttons-wrapper')}>
        <PrimaryButton
          text='Confirm'
          onClick={onConfirm}
        />
      </div>
    </div>
  </OnboardingStepsWrapper>;
};
