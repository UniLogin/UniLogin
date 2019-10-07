import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {ChooseConnectionMethod} from './ChooseConnectionMethod';
import {ConnectWithPassphrase} from './ConnectWithPassphrase';
import {ConnectWithEmoji} from './ConnectWithEmoji';

export type ConnectModal = 'chooseMethod' | 'emoji' | 'recover';

interface ConnectionFlowProps {
  name: string;
  onCancel: () => void;
  onSuccess: () => void;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  className?: string;
}

export const ConnectionFlow = ({name, onCancel, onSuccess, sdk, walletService, className}: ConnectionFlowProps) => {
  const [connectModal, setConnectModal] = useState<ConnectModal>('chooseMethod');

  switch (connectModal) {
    case 'chooseMethod':
      return (
        <ChooseConnectionMethod
          onConnectWithDeviceClick={() => setConnectModal('emoji')}
          onConnectWithPassphraseClick={() => setConnectModal('recover')}
          onCancel={onCancel}
          className={className}
        />
      );
    case 'recover':
      return (
        <ConnectWithPassphrase
          name={name!}
          walletService={walletService}
          onRecover={onSuccess}
        />
      );
    case 'emoji':
      return (
        <ConnectWithEmoji
          name={name!}
          sdk={sdk}
          walletService={walletService}
          onConnect={onSuccess}
          onCancel={() => setConnectModal('chooseMethod')}
        />
      );
  }
};
