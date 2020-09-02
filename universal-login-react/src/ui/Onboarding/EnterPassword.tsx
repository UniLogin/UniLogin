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

interface EnterPasswordProps {
  hideModal?: () => void;
  walletService: WalletService;
  onConfirm: (password: string) => Promise<void>;
}

export const EnterPassword = ({hideModal, walletService, onConfirm}: EnterPasswordProps) => {
  const [password, setPassword] = useInputField([passwordValidator]);
  const [loading, setLoading] = useState(false);
  const primaryButtonClassName = useClassFor('proceed-btn');

  const onConfirmClick = async () => {
    ensureNotFalsy(password, Error, 'Password is missing');
    setLoading(true);
    await onConfirm(password);
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
    </div>
    <div className={classForComponent('buttons-wrapper')}>
      {!loading
        ? <><SecondaryButton
          text='Back'
          onClick={() => console.log('click')}
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
