import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import '../styles/themes/Jarvis/onboardingSelectFlowThemeJarvis.sass';
import {InputField} from '../commons/InputField';
import {useInputField} from '../hooks/useInputField';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import {ensNameOrEmailValidator, isValidEmailOrEnsName} from '../../app/inputValidators/emailOrEnsNameValidator';
import {ClosingMessage} from '../commons/ClosingMessage';

export interface EmailFlowChooserProps {
  onCreateClick: (email: string, ensName: string) => void;
  onConnectClick: (emailOrEnsName: string) => void;
  domain: string;
  walletService: WalletService;
}

export const EmailFlowChooser = ({onCreateClick, onConnectClick, domain, walletService}: EmailFlowChooserProps) => {
  const [emailOrEnsName, setEmailOrEnsName, emailOrEnsNameError] = useInputField([ensNameOrEmailValidator]);
  const [flow, setFlow] = useState<'create' | 'connect'>('create');

  const handleClick = () => flow === 'connect' &&
    onConnectClick(emailOrEnsName);

  const isConfirmButtonDisabled = flow === 'connect'
    ? !emailOrEnsName || !isValidEmailOrEnsName(emailOrEnsName)
    : flow === 'create';

  return (
    <div className={useClassFor('select-flow')}>
      <div className={useClassFor('flow-wrapper')}>
        <div className={useClassFor('user-tabs')}>
          <button
            onClick={() => setFlow('create')}
            className={`${classForComponent('user-tab')} ${flow === 'create' && 'active'}`}>New user</button>
          <button
            onClick={() => setFlow('connect')}
            className={`${classForComponent('user-tab')} ${flow === 'connect' && 'active'}`}>Existing user</button>
        </div>
        <div className={useClassFor('flow-content')}>
          {flow === 'create' && <ClosingMessage />}
          {flow === 'connect' && <InputField
            id='email-or-ens-name-input'
            value={emailOrEnsName}
            setValue={setEmailOrEnsName}
            error={emailOrEnsNameError}
            label='Type a username or e-mail to search'
          />}
        </div>
      </div>
      <PrimaryButton text='Confirm' disabled={isConfirmButtonDisabled} onClick={handleClick} className={classForComponent('confirm-btn')} />
    </div >
  );
};
