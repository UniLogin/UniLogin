import React, {useState} from 'react';
import {CompanyLogo} from '../commons/CompanyLogo';
import {useClassFor, classForComponent} from '../utils/classFor';
// import '../styles/base/onboardingModal.sass';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import {ModalWrapperProps, ModalWrapper} from '../Modals/ModalWrapper';
import {WalletSelector, WalletSelectorProps} from '../WalletSelector/WalletSelector';

interface OnboardingSelectFlowProps extends WalletSelectorProps {
}

export const OnboardingSelectFlow = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions,
  placeholder,
  className
}: OnboardingSelectFlowProps) => {
  const [flow, setFlow] = useState('create');

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
          {flow == 'create' && <CreationFlow
            onCreateClick={onCreateClick}
            onConnectClick={onConnectClick}
            sdk={sdk}
            domains={domains}
            actions={actions}
            placeholder={placeholder}
            className={className}
          />}
          {flow == 'connect' && <ConnectionFlow
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
      <button className={classForComponent('confirm-btn')}>Confirm</button>
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
  className
}: WalletSelectorProps) => {
  return (
    <div>
      <p>Creation</p>
      <WalletSelector
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        sdk={sdk}
        domains={domains}
        actions={actions}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}

const ConnectionFlow = ({
  onCreateClick,
  onConnectClick,
  sdk,
  domains,
  actions,
  placeholder,
  className
}: WalletSelectorProps) => {
  return (
    <div>
      <p>Connection</p>
      <WalletSelector
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        sdk={sdk}
        domains={domains}
        actions={actions}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}