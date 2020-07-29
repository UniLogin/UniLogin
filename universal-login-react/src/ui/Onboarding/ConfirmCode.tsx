import React, {useState} from 'react';
import {ReactCodeInput} from './ReactCodeInput';
import {ensure, ensureNotFalsy} from '@unilogin/commons';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import {SecondaryButton} from '../commons/Buttons/SecondaryButton';
import {classForComponent, useClassFor} from '../utils/classFor';
import emailIcon from '../assets/icons/e-mail.svg';
import '../styles/base/confirmCode.sass';
import '../styles/themes/UniLogin/confirmCodeThemeUniLogin.sass';

const CODE_LENGTH = 6;

interface ConfirmCodeProps {
  email: string;
}

export const ConfirmCode = ({email}: ConfirmCodeProps) => {
  const [code, setCode] = useState<string | undefined>(undefined);

  const onConfirmClick = () => {
    ensureNotFalsy(code, Error, 'Code is missing');
    ensure(code?.length === CODE_LENGTH, Error, 'Code is incomplete.');
  };

  return <div className={useClassFor('onboarding-confirm-code-wrapper')}>
    <div className={classForComponent('onboarding-confirm-code-content')}>
      <div className={classForComponent('onboarding-icon-wrapper')}>
        <img src={emailIcon} alt="Email icon" className={classForComponent('onboarding-icon')}/>
      </div>
      <h4 className={classForComponent('onboarding-subtitle')}>Please verify the code below</h4>
      <p className={classForComponent('onboarding-description')}>We sent an email to <span className={classForComponent('span-email')}>{email}</span></p>
      <ReactCodeInput
        name='code-input'
        inputMode='numeric'
        type='number'
        wrapperClassName={classForComponent('input-code-wrapper')}
        inputClassName={classForComponent('input-code')}
        fields={6}
        value={code}
        onChange={setCode}
      />
    </div>
    <div className={classForComponent('buttons-wrapper')}>
      <SecondaryButton
        text='Back'
        onClick={() => console.log('Back')}
      />
      <PrimaryButton
        text='Confirm'
        disabled={!(code?.length === CODE_LENGTH)}
        onClick={onConfirmClick}
      />
    </div>
  </div>;
};
