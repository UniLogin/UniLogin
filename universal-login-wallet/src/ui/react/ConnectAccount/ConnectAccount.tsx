import React, {useState} from 'react';
import {ConnectSelector} from './ConnectSelector';
import {ChooseConnectionMethod} from './ChooseConnectionMethod';

export type ConnectModal = 'connectionMethod' | 'selector';

export const ConnectAccount = () => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [connectModal, setConnectModal] = useState<ConnectModal>('selector');
  if (connectModal === 'connectionMethod') {
    return <ChooseConnectionMethod name={name!}/>;
  } else {
    return <ConnectSelector setName={setName} setConnectModal={setConnectModal}/>;
  }
};
