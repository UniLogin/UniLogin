import React, {useState, useEffect} from 'react';
import {isProperEmail, isValidEnsName} from '@unilogin/commons';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/onboardingSelectFlow.sass';
import '../styles/themes/UniLogin/onboardingSelectFlowThemeUniLogin.sass';
import {InputField} from '../commons/InputField';
import {useInputField} from '../hooks/useInputField';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';

export interface EmailFlowChooserProps {
  onCreateClick: (email: string, ensName: string) => void;
  onConnectClick: (emailOrEnsName: string) => void;
  domain: string;
  walletService: WalletService;
}

const isEnsNameTaken = (sdk: UniLoginSdk) => async (name: string) => {
  return sdk.resolveName(name);
};

const ensNameValidators = (sdk: UniLoginSdk) => [
  {
    validate: isValidEnsName,
    errorMessage: 'Ens name is not valid',
  }, {
    errorMessage: 'Ens name already taken',
    validate: async (name: string) => !(await isEnsNameTaken(sdk)(name)),
  },
];

const isValidEmailOrEnsName = (value: string) => isValidEnsName(value) || isProperEmail(value);

const ensNameOrEmailValidator = {
  validate: isValidEmailOrEnsName,
  errorMessage: 'Invalid ENS name or email',
};

const emailValidator = {
  validate: isProperEmail,
  errorMessage: 'Email is not valid',
};

export const EmailFlowChooser = ({onCreateClick, onConnectClick, domain, walletService}: EmailFlowChooserProps) => {
  const [email, setEmail, emailError] = useInputField([emailValidator]);
  const [name, setName] = useState('');
  const [ensName, setEnsName, ensError] = useInputField(ensNameValidators(walletService.sdk));
  const [emailOrEnsName, setEmailOrEnsName, emailOrEnsNameError] = useInputField([ensNameOrEmailValidator]);
  const [flow, setFlow] = useState<'create' | 'connect'>('create');

  useEffect(() => {
    name ? setEnsName(`${name}.${domain}`) : setEnsName('');
  }, [name]);

  const handleClick = () => flow === 'connect'
    ? onConnectClick(emailOrEnsName)
    : onCreateClick(email, ensName);

  const isConfirmButtonDisabled = flow === 'connect'
    ? !emailOrEnsName || !isValidEmailOrEnsName(emailOrEnsName)
    : !ensName || !email || !isValidEnsName(ensName) || !isProperEmail(email);

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
          {flow === 'create' && <CreationContent
            email={email} setEmail={setEmail} emailError={emailError}
            ensName={name} setEnsName={setName} ensError={ensError}
            domain={domain}
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
      <PrimaryButton text='Confirm' disabled={isConfirmButtonDisabled} onClick={handleClick} className={classForComponent('confirm-btn')}/>
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
  domain: string;
}

const CreationContent = ({email, setEmail, emailError, ensName, setEnsName, ensError, domain}: CreationContentProps) =>
  <div className={classForComponent('creation-content')}>
    <div className={`${classForComponent('creation-item')} ${classForComponent('ens-name-input')}`}>
      <InputField
        id='ens-name-input'
        label='Type a username you want'
        setValue={setEnsName}
        value={ensName}
        error={ensError}
      />
      <div className={classForComponent('input-indicator-wrapper')}>
        <span className={classForComponent('input-ensname-indicator')}>.{domain}</span>
      </div>
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
