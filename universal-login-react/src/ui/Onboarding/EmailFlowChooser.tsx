import React, {useState} from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import Input from '../commons/Input';
import {Label} from '../commons/Form/Label';

type EmailFlow = {
  kind: 'create',
  onClick: () => void;
} | {
  kind: 'connect',
  onClick: () => void,
}

interface EmailFlowChooserProps {
  onCreateClick: () => void;
  onConnectClick: () => void;
}

interface EmailInputProps {
  domainName: string;
}

export const EmailFlowChooser = ({onCreateClick, onConnectClick}: EmailFlowChooserProps) => {
  const [flow, setFlow] = useState<EmailFlow>({kind: 'create', onClick: onCreateClick});

  return (
    <div className={useClassFor('select-flow')}>
      <div className={useClassFor('flow-wrapper')}>
        <div className={useClassFor('user-tabs')}>
          <button
            onClick={() => setFlow({kind: 'create', onClick: onCreateClick})}
            className={`${classForComponent('user-tab')} ${flow.kind === 'create' ? 'active' : ''}`}>New user</button>
          <button
            onClick={() => setFlow({kind: 'connect', onClick: onConnectClick})}
            className={`${classForComponent('user-tab')} ${flow.kind === 'connect' ? 'active' : ''}`}>Existing user</button>
        </div>
        <div className={useClassFor('flow-content')}>
          {flow.kind === 'create' && <CreationContent/>}
          {flow.kind === 'connect' && <ConnectionContent/>}
        </div>
      </div>
      <button onClick={flow.onClick} className={classForComponent('confirm-btn')}>Confirm</button>
    </div>
  );
}

const CreationContent = () => {
  return (
    <>
      <Label>Type a username you want:</Label>
      <Input className={` ${useClassFor('input')} ${classForComponent('input-ens-name')}}`} id='email-input' onChange={() => console.log('email')}/>
      <p className={`${useClassFor('input-description')} ${classForComponent('username-suggestion')}`}>our suggestion: <b>satoshi93.unilogin.eth</b></p>
      <Label>Your e-mail</Label>
      <Input className={` ${useClassFor('input')} ${classForComponent('input-email')}}`} id='email-input' onChange={() => console.log('email')}/>
      <p className={useClassFor('input-description')}>We wil use your email and a password to help you recover your account. We do not hold custody of your funds. If you’d rather not share an email, <a href='#' className={classForComponent('description-link')}>download an app.</a></p>
    </>
  );
};

const ConnectionContent = () => {
  return (
    <>
      <Label>Type a username or e-mail to search:</Label>
      <Input className={` ${useClassFor('input')} ${classForComponent('input-ens-name')}}`} id='email-input' onChange={() => console.log('email')}/>
    </>
  );
};
