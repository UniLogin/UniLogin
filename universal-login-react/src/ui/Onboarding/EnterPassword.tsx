import React, {useState} from 'react';
import {ensureNotFalsy} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {useClassFor, classForComponent} from '../utils/classFor';
import {InputField} from '../commons/InputField';
import {useInputField} from '../hooks/useInputField';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import '../styles/base/enterPassword.sass';
import '../styles/themes/UniLogin/enterPasswordThemeUniLogin.sass';
import pinCodeIcon from '../assets/icons/pin-code.svg';
import {SecondaryButton} from '../commons/Buttons/SecondaryButton';
import Spinner from '../commons/Spinner';
import {passwordValidator} from '../../app/inputValidators/passwordValidator';
import {Hint} from '../commons/PasswordHint';

interface EnterPasswordProps {
  hideModal?: () => void;
  walletService: WalletService;
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
}

export const EnterPassword = ({hideModal, walletService, onCancel, onConfirm}: EnterPasswordProps) => {
  const [password, setPassword] = useInputField([passwordValidator]);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | undefined>(undefined);
  const primaryButtonClassName = useClassFor('proceed-btn');

  const onConfirmClick = async () => {
    setHint(undefined);
    ensureNotFalsy(password, Error, 'Password is missing');
    setLoading(true);
    try {
      await onConfirm(password);
    } catch (e) {
      if (e.message === 'invalid password') {
        setHint('Password is invalid');
      } else {
        throw e;
      }
    }
    setLoading(false);
  };

  return <OnboardingStepsWrapper
    title='Log-in'
    className='onboarding-enter-password'
    hideModal={hideModal}
    message={walletService.sdk.getNotice()}
    steps={4}
    progress={3}>
    <div className={`${classForComponent('onboarding-content-wrapper')}`}>
      <div className={classForComponent('onboarding-icon-wrapper')}>
        <img src={pinCodeIcon} alt="pin-code icon" className={classForComponent('oboarding-pin-code-icon')}/>
      </div>
      <div className={`${classForComponent('input-item')}`}>
        <InputField
          label={'Enter the password'}
          type={'password'}
          id={'password-input'}
          className={classForComponent('password-input-wrapper first')}
          value={password}
          setValue={setPassword}
        />
      </div>
      {hint !== undefined ? <Hint text={hint} /> : <div className={classForComponent('info-text-hint-placeholder')} />}
    </div>
    <div className={classForComponent('buttons-wrapper')}>
      {!loading
        ? <><SecondaryButton
          text='Cancel'
          onClick={onCancel}
          className={classForComponent('back-btn')}/>
        <PrimaryButton
          text='Confirm'
          disabled={password === ''}
          onClick={onConfirmClick}
          className={primaryButtonClassName}
        /></>
        : <Spinner/>}
    </div>
  </OnboardingStepsWrapper>;
};
