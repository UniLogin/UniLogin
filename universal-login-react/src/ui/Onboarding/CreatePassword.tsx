import React, {useState, useEffect} from 'react';
import {ensure, ensureNotFalsy} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {useClassFor, classForComponent} from '../utils/classFor';
import {isConfirmPasswordButtonDisabled} from '../../app/isConfirmPasswordButtonDisabled';
import {InputField} from '../commons/InputField';
import {useInputField} from '../hooks/useInputField';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import '../styles/base/enterPassword.sass';
import '../styles/themes/UniLogin/enterPasswordThemeUniLogin.sass';
import pinCodeIcon from '../assets/icons/pin-code.svg';
import {passwordValidator} from '../../app/inputValidators/passwordValidator';
import {Spinner} from '../..';
import {Hint} from '../commons/PasswordHint';

interface CreatePasswordProps {
  hideModal?: () => void;
  walletService: WalletService;
  onConfirm: (password: string) => void;
}

export const CreatePassword = ({hideModal, walletService, onConfirm}: CreatePasswordProps) => {
  const [password, setPassword, passwordError] = useInputField([passwordValidator]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | undefined>(undefined);
  const buttonClass = useClassFor('proceed-btn');

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
    ensureNotFalsy(password, Error, 'Password is missing');
    ensureNotFalsy(confirmPassword, Error, 'Password confirmation missing');
    ensure(password === confirmPassword, Error, 'Password and password confirmation are different');
    setLoading(true);
    onConfirm(password);
  };

  return <OnboardingStepsWrapper
    title='Create'
    className='onboarding-enter-password'
    hideModal={hideModal}
    message={walletService.sdk.getNotice()}
    steps={4}
    progress={3}>
    <div className={`${classForComponent('onboarding-content-wrapper')}`}>
      <div className={classForComponent('onboarding-icon-wrapper')}>
        <img src={pinCodeIcon} alt="pin-code icon" className={classForComponent('oboarding-pin-code-icon')} />
      </div>
      <div className={`${classForComponent('input-item')}`}>
        <InputField
          label='Enter the password'
          type='password'
          id='password-input'
          className={classForComponent('password-input-wrapper first')}
          value={password}
          setValue={setPassword}
          error={passwordError}
        />
      </div>
      <div className={`${classForComponent('input-item')}`}>
        <InputField
          label='Confirm the password'
          type='password'
          id='password-input-confirmation'
          className={classForComponent('password-input-wrapper second')}
          value={confirmPassword}
          setValue={setConfirmPassword}
        />
        {hint !== undefined ? <Hint text={hint} /> : <div className={classForComponent('info-text-hint-placeholder')} />}
      </div>
    </div>
    <div className={classForComponent('buttons-wrapper')}>
      {!loading
        ? <PrimaryButton
          text='Confirm'
          disabled={isConfirmPasswordButtonDisabled(password, confirmPassword)}
          onClick={onConfirmClick}
          className={buttonClass}
        />
        : <Spinner />}
    </div>
  </OnboardingStepsWrapper>;
};
