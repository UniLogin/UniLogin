import React, {useState} from 'react';
import {ConnectFlow} from '@universal-login/react';
import {ConnectSelector} from './ConnectSelector';
import {useServices, useRouter} from '../../hooks';

export type ConnectModal = 'connectionFlow' | 'selector';

export const ConnectAccount = () => {
  const {history} = useRouter();
  const {sdk, walletService} = useServices();
  const [name, setName] = useState<string | undefined>(undefined);
  const [connectModal, setConnectModal] = useState<ConnectModal>('selector');
  if (connectModal === 'connectionFlow') {
    return <ConnectFlow
      name={name!}
      sdk={sdk}
      walletService={walletService}
      onCancel={() => setConnectModal('selector')}
      onSuccess={() => history.push('/')}
      className={'jarvis-connect'}
    />;
  } else {
    return <ConnectSelector setName={setName} setConnectModal={setConnectModal} />;
  }
};
