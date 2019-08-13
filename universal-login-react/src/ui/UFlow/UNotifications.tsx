import React from 'react';
import {EmojiPanel} from '../WalletSelector/EmojiPanel';
import {EmojiForm} from '../Notifications/EmojiForm';
import {TEST_ACCOUNT_ADDRESS, generateCode, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {useServices} from '../../core/services/useServices';

export const UNotifications = () => {
  const {sdk} = useServices();

  return (
    <div>
      <EmojiPanel code={generateCode(TEST_ACCOUNT_ADDRESS)} />
      <EmojiForm
        sdk={sdk}
        publicKey={TEST_ACCOUNT_ADDRESS}
        contractAddress={TEST_CONTRACT_ADDRESS}
        privateKey={TEST_PRIVATE_KEY}
      />
    </div>
  );
};
