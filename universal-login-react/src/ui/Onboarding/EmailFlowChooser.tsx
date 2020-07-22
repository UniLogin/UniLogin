import React, {useState} from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import Input from '../commons/Input';
import {Label} from '../commons/Form/Label';

export interface EmailFlowChooserProps {
  onCreateClick: (email: string, ensName: string) => void;
  onConnectClick: (emailOrEnsName: string) => void;
}

export const EmailFlowChooser = ({onCreateClick, onConnectClick}: EmailFlowChooserProps) => {
  const [email, setEmail] = useState('');
  const [ensName, setEnsName] = useState('');
  const [emailOrEnsName, setEmailOrEnsName] = useState('');
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
          {flow === 'create' && <CreationContent email={email} setEmail={setEmail} ensName={ensName} setEnsName={setEnsName} />}
          {flow === 'connect' && <ConnectionContent emailOrEnsName={emailOrEnsName} setEmailOrEnsName={setEmailOrEnsName} />}
        </div>
      </div>
      <button onClick={handleClick} className={classForComponent('confirm-btn')}>Confirm</button>
    </div >
  );
};

interface CreationContentProps {
  email: string;
  setEmail: (email: string) => void;
  ensName: string;
  setEnsName: (ensName: string) => void;
}

const CreationContent = ({email, setEmail, ensName, setEnsName}: CreationContentProps) =>
  <>
    <Label>Type a username you want:</Label>
    <Input
      className={` ${useClassFor('input')}`}
      id='ens-name-input'
      onChange={(event) => setEnsName(event.target.value)}
      value={ensName}
    />
    <p className={`${useClassFor('input-description')} ${classForComponent('username-suggestion')}`}>our suggestion: <b>satoshi93.unilogin.eth</b></p>
    <Label>Your e-mail</Label>
    <Input
      id='email-input'
      className={` ${useClassFor('input')}`}
      onChange={(event) => setEmail(event.target.value)}
      value={email}
    />
    <p className={useClassFor('input-description')}>We wil use your email and a password to help you recover your account. We do not hold custody of your funds. If you’d rather not share an email, <a href='#' className={classForComponent('description-link')}>download an app.</a></p>
  </>;

interface ConnectionContentProps {
  emailOrEnsName: string;
  setEmailOrEnsName: (emailOrEnsName: string) => void;
}

const ConnectionContent = ({emailOrEnsName, setEmailOrEnsName}: ConnectionContentProps) =>
  <>
    <Label>Type a username or e-mail to search:</Label>
    <Input
      className={` ${useClassFor('input')}`}
      id='email-or-ens-name-input'
      onChange={(event) => setEmailOrEnsName(event.target.value)}
      value={emailOrEnsName}
    />
  </>;
