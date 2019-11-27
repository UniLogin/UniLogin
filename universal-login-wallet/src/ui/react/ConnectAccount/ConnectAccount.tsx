import React, {useState} from 'react';
import {ConnectionFlow} from '@universal-login/react';
import {ConnectSelector} from './ConnectSelector';
import {useServices} from '../../hooks';
import {useHistory} from 'react-router';

export type ConnectModal = 'connectionFlow' | 'selector';
export const ConnectAccount = () => {
  const {sdk, walletService} = useServices();
  const history = useHistory();
  const [name, setName] = useState<string | undefined>(undefined);
  const [connectModal, setConnectModal] = useState<ConnectModal>('selector');
  switch (connectModal) {
    case 'connectionFlow':
      return <ConnectionFlow
        name={name!}
        sdk={sdk}
        walletService={walletService}
        onCancel={() => setConnectModal('selector')}
        onSuccess={() => history.push('/connectionSucceed')}
        className="jarvis-styles"
      />;
    case 'selector':
      return <ConnectSelector setName={setName} setConnectModal={setConnectModal} />;
  }
};
