import React, {useState, useEffect} from 'react';
import {ensure, ensureNotFalsy, isProperPassword} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {useClassFor} from '../utils/classFor';
import {isConfirmPasswordButtonDisabled} from '../../app/isConfirmPasswordButtonDisabled';
import {InputField, useInputField} from '../commons/InputField';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import '../styles/base/enterPassword.sass';
import '../styles/themes/UniLogin/enterPasswordThemeUniLogin.sass';

interface EnterPasswordProps {
  hideModal: () => void;
  walletService: WalletService;
}

export const EnterPassword = ({hideModal, walletService}: EnterPasswordProps) => {
  const [password, setPassword, passwordError] = useInputField(isProperPassword, 'Password must have more than 10 letters and one capital letter');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hint, setHint] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (confirmPassword && password.length > confirmPassword.length) {
      setHint('Keep typing, password and password confirmation are different.');
    } else if (confirmPassword && password !== confirmPassword) {
      setHint('Password and password confirmation are different.');
    } else {
      setHint(undefined);
    }
  }, [password, confirmPassword]);

  const onConfirmClick = () => {
    ensureNotFalsy(password, Error, 'Password missing');
    ensureNotFalsy(confirmPassword, Error, 'Password confirmation missing');
    ensure(password === confirmPassword, Error, 'Password and password confirmation are different');
  };

  return <OnboardingStepsWrapper
    title='Create'
    className='onboarding-select-flow'
    hideModal={hideModal}
    message={walletService.sdk.getNotice()}
    steps={4}
    progress={3}>
    <InputField
      label={'Enter the password'}
      type={'password'}
      id={'password-input'}
      value={password}
      setValue={setPassword}
      error={passwordError}
    />
    <InputField
      label={'Confirm the password'}
      type={'password'}
      id={'password-input'}
      value={confirmPassword}
      setValue={setConfirmPassword}
    />
    {hint && <Hint text={hint}/>}
    <PrimaryButton
      disabled={isConfirmPasswordButtonDisabled(password, confirmPassword)}
      text='Confirm'
      onClick={onConfirmClick}/>
  </OnboardingStepsWrapper>;
};

const Hint = ({text}: {text: string}) => {
  return <div className={useClassFor('info-text-hint')}>{text}</div>;
};
