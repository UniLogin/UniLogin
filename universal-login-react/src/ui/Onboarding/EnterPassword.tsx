import React, {useState, useEffect} from 'react';
import {ensure, ensureNotFalsy, isProperPassword} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import Input from '../commons/Input';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {useClassFor} from '../utils/classFor';
import {isButtonDisabled} from '../../app/isButtonDisabled';

interface EnterPasswordProps {
  hideModal: () => void;
  walletService: WalletService;
}

export const EnterPassword = ({hideModal, walletService}: EnterPasswordProps) => {
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);
  const [hint, setHint] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (password && !isProperPassword(password)) {
      setHint('Password must have more than 10 letters and one capital letter');
    } else if (password && confirmPassword && confirmPassword?.length >= password?.length) {
      if (password !== confirmPassword) {
        setHint('Password and password confirmation are different.');
      }
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
    <Input type={'password'} id={'password-input'} onChange={(event) => setPassword(event.target.value)}/>
    <Input type={'password'} id={'password-input'} onChange={(event) => setConfirmPassword(event.target.value)}/>
    {hint && <Hint text={hint}/>}
    <button disabled={isButtonDisabled(password, confirmPassword)} onClick={onConfirmClick}>Confirm</button>
  </OnboardingStepsWrapper>;
};

const Hint = ({text}: {text: string}) => {
  return <div className={useClassFor('info-text-hint')}>{text}</div>;
};
