import React, {useState} from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import {WalletSelector, WalletSelectorProps} from '../WalletSelector/WalletSelector';
import Input from '../commons/Input';
import {Label} from '../commons/Form/Label';

interface OnboardingSelectFlowProps extends WalletSelectorProps {
}

export const OnboardingSelectFlow = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions,
  placeholder,
  className,
}: OnboardingSelectFlowProps) => {
  const [flow, setFlow] = useState('create');

  const handleConfirmClick = () => {
    const ensName = 'satoshi93.unilogin.eth';
    if (flow === 'create') {
      onCreateClick!(ensName);
    } else if (flow === 'connect') {
      onConnectClick!(ensName);
    }
  };

  return (
    <div className={useClassFor('select-flow')}>
      <div className={useClassFor('flow-wrapper')}>
        <div className={useClassFor('user-tabs')}>
          <button
            onClick={() => setFlow('create')}
            className={`${classForComponent('user-tab')} ${flow == 'create' ? 'active': ''}`}>New user</button>
          <button
            onClick={() => setFlow('connect')}
            className={`${classForComponent('user-tab')} ${flow == 'connect' ? 'active': ''}`}>Existing user</button>
        </div>
        <div className={useClassFor('flow-content')}>
          {flow === 'create' && <CreationFlow
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            sdk={sdk}
            domains={domains}
            actions={actions}
            placeholder={placeholder}
            className={className}
          />}
          {flow === 'connect' && <ConnectionFlow
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            sdk={sdk}
            domains={domains}
            actions={actions}
            placeholder={placeholder}
            className={className}
          />}
        </div>
      </div>
      <button onClick={handleConfirmClick} className={classForComponent('confirm-btn')}>Confirm</button>
    </div>
  );
}

const CreationFlow = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions,
  placeholder,
  className,
}: WalletSelectorProps) => {
  return (
    <>
      <Label>Type a username you want:</Label>
      <WalletSelector
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        sdk={sdk}
        domains={domains}
        actions={actions}
        placeholder={placeholder}
        className={className}
      />
      <p className={`${useClassFor('input-description')} ${classForComponent('username-suggestion')}`}>our suggestion: <b>satoshi93.unilogin.eth</b></p>
      <Label>Your e-mail</Label>
      <Input className={` ${useClassFor('input')} ${classForComponent('input-email')}}`} id='email-input' onChange={() => console.log('email')}/>
      <p className={useClassFor('input-description')}>We wil use your email and a password to help you recover your account. We do not hold custody of your funds. If you’d rather not share an email, <a href='#' className={classForComponent('description-link')}>download an app.</a></p>
    </>
  );
};

const ConnectionFlow = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions,
  placeholder,
  className,
}: WalletSelectorProps) => {
  return (
    <>
      <Label>Type a username or e-mail to search:</Label>
      <WalletSelector
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        sdk={sdk}
        domains={domains}
        actions={actions}
        placeholder={placeholder}
        className={className}
      />
    </>
  );
};
