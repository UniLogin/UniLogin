import React, {useState} from 'react';
import {useHistory} from 'react-router';
import {ensureNotFalsy} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {useClassFor, classForComponent} from '../utils/classFor';
import {InputField} from '../commons/InputField';
import {useInputField} from '../hooks/useInputField';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import '../styles/base/enterEmail.sass';
import '../styles/themes/UniLogin/enterEmailThemeUniLogin.sass';
import emailIcon from '../assets/icons/e-mail.svg';
import {SecondaryButton} from '../commons/Buttons/SecondaryButton';
import Spinner from '../commons/Spinner';
import {OnboardingStepsWrapper} from '../Onboarding/OnboardingStepsWrapper';
import {emailValidator} from '../../app/inputValidators/emailValidator';

export interface EnterEmailProps {
  hideModal?: () => void;
  walletService: WalletService;
  onConfirm: (email: string) => Promise<void>;
}

export const EnterEmail = ({hideModal, walletService, onConfirm}: EnterEmailProps) => {
  const history = useHistory();
  const [email, setEmail, emailError] = useInputField([emailValidator]);
  const [loading, setLoading] = useState(false);
  const primaryButtonClassName = useClassFor('proceed-btn');

  const onConfirmClick = async () => {
    ensureNotFalsy(email, Error, 'Email is missing');
    setLoading(true);
    await onConfirm(email);
  };

  return <OnboardingStepsWrapper
    title='Secure with email'
    className='onboarding-enter-email'
    hideModal={hideModal}
    message={walletService.sdk.getNotice()}
    steps={4}
    progress={1}>
    <div className={`${classForComponent('onboarding-content-wrapper')}`}>
      <div className={classForComponent('onboarding-icon-wrapper')}>
        <img src={emailIcon} alt="email-icon"/>
      </div>
      <div className={`${classForComponent('input-item')}`}>
        <InputField
          label={'Enter the email'}
          type={'email'}
          id={'email-input'}
          className={classForComponent('email-input-wrapper first')}
          value={email}
          setValue={setEmail}
          error={emailError}
        />
      </div>
    </div>
    <div className={classForComponent('buttons-wrapper')}>
      {!loading
        ? <><SecondaryButton
          text='Back'
          onClick={() => history.goBack()}
          className={classForComponent('back-btn')}/>
        <PrimaryButton
          text='Confirm'
          disabled={email === '' || !!emailError}
          onClick={onConfirmClick}
          className={primaryButtonClassName}
        /></>
        : <Spinner/>}
    </div>
  </OnboardingStepsWrapper>;
};
