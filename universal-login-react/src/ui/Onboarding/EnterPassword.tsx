import React, {useState, useEffect} from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {WalletService} from '@unilogin/sdk';
import Input from '../commons/Input';
import {ensure, ensureNotFalsy} from '@unilogin/commons';

interface EnterPasswordProps {
  hideModal: () => void;
  walletService: WalletService;
}

export const EnterPassword = ({hideModal, walletService}: EnterPasswordProps) => {
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);
  const [tips, setTips] = useState<string[] | undefined>(undefined);
  useEffect(() => {
    if (password?.length === confirmPassword?.length) {
      if (password !== confirmPassword) {
        console.log('lol')
        setTips(['Password and password confirmation are different.'])
        console.log({tips});
      }
    }
  }, [password, confirmPassword]);

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
    {tips && <div>Lol</div>}
    <button onClick={onConfirmClick}>Confirm</button>
  </OnboardingStepsWrapper>;
};

const Tip = ({text}: {text: string}) => {
  return <div className="password-tip">{text}</div>;
}