import React, {useState} from 'react';
import {ConnectSelector} from './ConnectSelector';
import {ChooseConnectionMethod} from './ChooseConnectionMethod';
import {ConnectWithPassphrase} from './ConnectWithPassphrase';
import {ConnectWithEmoji} from './ConnectWithEmoji';

export type ConnectModal = 'connectionMethod' | 'selector' | 'recover' | 'emoji';

export const ConnectAccount = () => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [connectModal, setConnectModal] = useState<ConnectModal>('selector');
  if (connectModal === 'connectionMethod') {
    return <ChooseConnectionMethod name={name!} setConnectModal={setConnectModal}/>;
  } else if (connectModal === 'recover') {
    return <ConnectWithPassphrase name={name!}/>;
  } else if (connectModal === 'emoji') {
    return <ConnectWithEmoji name={name!} setConnectModal={setConnectModal} />;
  } else {
    return <ConnectSelector setName={setName} setConnectModal={setConnectModal}/>;
  }
};
