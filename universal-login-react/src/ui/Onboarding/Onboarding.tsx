import React, {useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSuggestionAction, generateCode, TEST_ACCOUNT_ADDRESS, createKeyPair} from '@universal-login/commons';
import {OnboardingComponentType} from '../../core/models/OnboardingComponentType';
import {OnboardingChoice} from './OnboardingChoice';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {EmojiPanel} from '../WalletSelector/EmojiPanel';
import {TopUp} from '../TopUp/TopUp';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnectClick: (...args: any[]) => void;
  onCreateClick: (...args: any[]) => void;
}

export const Onboarding = ({sdk, onConnectClick, onCreateClick}: OnboardingProps) => {
  const [modal, setModal] = useState<OnboardingComponentType>(OnboardingComponentType.walletSelector);

  const renderWalletSelector = (actions: WalletSuggestionAction[]) => (
    <WalletSelector
      sdk={sdk}
      onCreateClick={() => setModal(OnboardingComponentType.topup)}
      onConnectClick={() => setModal(OnboardingComponentType.emojiPanel)}
      actions={actions}
      domains={['mylogin.eth', 'myapp.eth']}
    />
  );

  if (modal === OnboardingComponentType.walletSelector) {
    return (
      <ModalWrapper isVisible modalPosition="center">
        <OnboardingChoice onChoice={setModal}/>
      </ModalWrapper>
    );
  }
  else if (modal === OnboardingComponentType.connect) {
    return renderWalletSelector([WalletSuggestionAction.connect]);
  }
  else if (modal === OnboardingComponentType.create) {
    return renderWalletSelector([WalletSuggestionAction.create]);
  }
  else if (modal === OnboardingComponentType.emojiPanel) {
    return (
      <EmojiPanel code={generateCode(TEST_ACCOUNT_ADDRESS)}/>
    );
  }
  else if (modal === OnboardingComponentType.topup) {
    const {publicKey} = createKeyPair();
    return (
      <TopUp
        contractAddress={publicKey}
        onRampConfig={{safello: {
          appId: '1234-5678',
          baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
          addressHelper: true
        }}}
      />
    );
  }
  return (
    <>Dupa</>
  );
};
