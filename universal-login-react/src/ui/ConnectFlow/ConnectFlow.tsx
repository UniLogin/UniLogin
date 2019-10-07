import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {ChooseConnectionMethod} from './ChooseConnectionMethod';
import {ConnectWithPassphrase} from './ConnectWithPassphrase';
import {ConnectWithEmoji} from './ConnectWithEmoji';

export type ConnectModal = 'chooseMethod' | 'emoji' | 'recover';

interface ConnectFlowProps {
  name: string;
  onCancel: () => void;
  onFlowSucceeded: () => void;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
}

export const ConnectFlow = ({name, onCancel, onFlowSucceeded, sdk, walletService}: ConnectFlowProps) => {
  const [connectModal, setConnectModal] = useState<ConnectModal>('chooseMethod');

  switch (connectModal) {
    case 'chooseMethod':
      return (
        <ChooseConnectionMethod
          onConnectWithDeviceClick={() => setConnectModal('emoji')}
          onConnectWithPassphraseClick={() => setConnectModal('recover')}
          onCancel={onCancel}
        />
      );
    case 'recover':
      return (
        <ConnectWithPassphrase
          name={name!}
          walletService={walletService}
          onRecover={onFlowSucceeded}
        />
      );
    case 'emoji':
      return (
        <ConnectWithEmoji
          name={name!}
          sdk={sdk}
          walletService={walletService}
          onConnect={onFlowSucceeded}
          onCancel={() => setConnectModal('chooseMethod')}
        />
      );
  }
};
