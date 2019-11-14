import React, {useState} from 'react';
import {useHistory} from 'react-router';
import {ConnectionFlow} from '@universal-login/react';
import {ConnectSelector} from './ConnectSelector';
import {useServices} from '../../hooks';
import {ConnectionSuccess} from '../Modals/ModalTxnSuccess';

export type ConnectModal = 'connectionFlow' | 'selector' | 'connectionSucceed';

export const ConnectAccount = () => {
  const history = useHistory();
  const {sdk, walletService} = useServices();
  const [name, setName] = useState<string | undefined>(undefined);
  const [connectModal, setConnectModal] = useState<ConnectModal>('selector');
  switch (connectModal) {
    case 'connectionFlow':
      return <ConnectionFlow
        name={name!}
        sdk={sdk}
        walletService={walletService}
        onCancel={() => setConnectModal('selector')}
        onSuccess={() => setConnectModal('connectionSucceed')}
        className="jarvis-styles"
      />;
    case 'connectionSucceed':
      return <ConnectionSuccess hideModal={() => {history.replace('/');}}/>;
    case 'selector':
      return <ConnectSelector setName={setName} setConnectModal={setConnectModal} />;
  }
};
