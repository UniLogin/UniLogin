import React, {useState, useEffect} from 'react';
import {ensure, ensureNotFalsy, isProperPassword} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import Input from '../commons/Input';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {useClassFor} from '../utils/classFor';

interface EnterPasswordProps {
  hideModal: () => void;
  walletService: WalletService;
}

export const EnterPassword = ({hideModal, walletService}: EnterPasswordProps) => {
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);
  const [tip, setTip] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (password && !isProperPassword(password)) {
      setTip('Password must have more than 10 letters and one capital letter');
    } else if (password && confirmPassword && confirmPassword?.length >= password?.length) {
      if (password !== confirmPassword) {
        setTip('Password and password confirmation are different.');
      }
    } else {
      setTip(undefined);
    }
  }, [password, confirmPassword]);

  const isButtonDisabled = () => !password || isProperPassword(password) || !confirmPassword || password !== confirmPassword;

  const onConfirmClick = () => {
    ensureNotFalsy(password, Error, 'Password missing');
    ensureNotFalsy(confirmPassword, Error, 'Password confirmation missing');
    ensure(password === confirmPassword, Error, 'Password and password confirmation are different');
  }

  return <OnboardingStepsWrapper
    title='Create'
    className='onboarding-select-flow'
    hideModal={hideModal}
    message={walletService.sdk.getNotice()}
    steps={4}
    progress={3}>
    <Input type={'password'} id={'password-input'} onChange={(event) => setPassword(event.target.value)}/>
    <Input type={'password'} id={'password-input'} onChange={(event) => setConfirmPassword(event.target.value)}/>
    {tip && <Tip text={tip}/>}
    <button disabled={isButtonDisabled()} onClick={onConfirmClick}>Confirm</button>
  </OnboardingStepsWrapper>;
};

const Tip = ({text}: {text: string}) => {
  return <div className={useClassFor('info-text-hint')}>{text}</div>;
}