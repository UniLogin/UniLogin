import React, {useState} from 'react';
import {isProperEmail, isValidEnsName} from '@unilogin/commons';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import {InputField, useInputField} from '../commons/InputField';

export interface EmailFlowChooserProps {
  onCreateClick: (email: string, ensName: string) => void;
  onConnectClick: (emailOrEnsName: string) => void;
}

export const EmailFlowChooser = ({onCreateClick, onConnectClick}: EmailFlowChooserProps) => {
  const [email, setEmail, emailError] = useInputField(isProperEmail, 'Email is not valid');
  const [ensName, setEnsName, ensError] = useInputField(isValidEnsName, 'Ens name is not valid');
  const [emailOrEnsName, setEmailOrEnsName, emailOrEnsNameError] = useInputField(value => isValidEnsName(value) || isProperEmail(value), 'Write correct ens name or email');
  const [flow, setFlow] = useState<'create' | 'connect'>('create');

  const handleClick = () => flow === 'connect'
    ? onConnectClick(emailOrEnsName)
    : onCreateClick(email, ensName);

  return (
    <div className={useClassFor('select-flow')}>
      <div className={useClassFor('flow-wrapper')}>
        <div className={useClassFor('user-tabs')}>
          <button
            onClick={() => setFlow('create')}
            className={`${classForComponent('user-tab')} ${flow === 'create' ? 'active' : ''}`}>New user</button>
          <button
            onClick={() => setFlow('connect')}
            className={`${classForComponent('user-tab')} ${flow === 'connect' ? 'active' : ''}`}>Existing user</button>
        </div>
        <div className={useClassFor('flow-content')}>
          {flow === 'create' && <CreationContent
            email={email} setEmail={setEmail} emailError={emailError}
            ensName={ensName} setEnsName={setEnsName} ensError={ensError}
          />}
          {flow === 'connect' && <InputField
            id='email-or-ens-name-input'
            value={emailOrEnsName}
            setValue={setEmailOrEnsName}
            error={emailOrEnsNameError}
            label='Type a username or e-mail to search'
          />}
        </div>
      </div>
      <button onClick={handleClick} className={classForComponent('confirm-btn')}>Confirm</button>
    </div >
  );
};

interface CreationContentProps {
  email: string;
  setEmail: (email: string) => void;
  emailError?: string;
  ensName: string;
  setEnsName: (ensName: string) => void;
  ensError?: string;
}

const CreationContent = ({email, setEmail, emailError, ensName, setEnsName, ensError}: CreationContentProps) =>
  <div className={`${classForComponent('creation-content')}`}>
    <div className={`${classForComponent('creation-item')}`}>
      <InputField
        id='ens-name-input'
        label='Type a username you want'
        setValue={setEnsName}
        value={ensName}
        error={ensError}
      />
    </div>
    <div className={`${classForComponent('creation-item')}`}>
      <InputField
        id='email-input'
        label='Your e-mail'
        setValue={setEmail}
        value={email}
        description='We will use your email and password to help you recover your account. We do not hold custody of your funds.'
        error={emailError}
      />
    </div>
  </div>;
