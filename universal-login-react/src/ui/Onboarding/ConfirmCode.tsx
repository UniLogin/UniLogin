import React, {useState} from 'react';
import {ReactCodeInput} from './ReactCodeInput';
import {ensure, ensureNotFalsy} from '@unilogin/commons';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import {SecondaryButton} from '../commons/Buttons/SecondaryButton';
import {classForComponent, useClassFor} from '../utils/classFor';
import emailIcon from '../assets/icons/e-mail.svg';
import emailSuccessIcon from '../assets/icons/e-mail-success.svg';
import '../styles/base/confirmCode.sass';
import '../styles/themes/UniLogin/confirmCodeThemeUniLogin.sass';

const CODE_LENGTH = 6;

interface ConfirmCodeProps {
  email: string;
}

const getSubText = (isValid: undefined | boolean) => {
  switch (isValid) {
    case true:
      return 'Success!';
    case false:
      return 'Try again!';
    default:
      return 'Please verify the code below';
  }
};

export const ConfirmCode = ({email}: ConfirmCodeProps) => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  const onConfirmClick = () => {
    ensureNotFalsy(code, Error, 'Code is missing');
    ensure(code?.length === CODE_LENGTH, Error, 'Code is incomplete.');
    setIsValid(true);
  };

  return <div className={useClassFor('onboarding-confirm-code-wrapper')}>
    <div className={classForComponent('onboarding-confirm-code-content')}>
      <div className={`${classForComponent('onboarding-icon-wrapper')} ${isValid && 'success'}`}>
        <img src={!isValid ? emailIcon : emailSuccessIcon} alt="Email icon" className={classForComponent('onboarding-icon')}/>
      </div>
      <h4 className={classForComponent('onboarding-subtitle')}>{getSubText(isValid)}</h4>
      {isValid && <p className={classForComponent('onboarding-description')}>E-mail confirmed</p>}
      {!isValid &&
      <div><p className={classForComponent('onboarding-description')}>
        We sent an email to <span className={classForComponent('span-email')}>{email}</span>
      </p>
      <ReactCodeInput
        name='code-input'
        inputMode='numeric'
        type='number'
        wrapperClassName={classForComponent('input-code-wrapper')}
        inputClassName={classForComponent('input-code')}
        fields={6}
        value={code}
        onChange={setCode}
        disabled={isValid}
      /></div>}
    </div>
    {!isValid && <div className={classForComponent('buttons-wrapper')}>
      <SecondaryButton
        text='Back'
        onClick={() => console.log('Back')}
      />
      <PrimaryButton
        text='Confirm'
        disabled={!(code?.length === CODE_LENGTH)}
        onClick={onConfirmClick}
      />
    </div>}
  </div>;
};
