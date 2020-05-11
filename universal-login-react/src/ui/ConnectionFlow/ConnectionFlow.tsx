import {join} from 'path';
import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {ChooseConnectionMethod} from './ChooseConnectionMethod';
import {ConnectWithPassphrase} from './ConnectWithPassphrase';
import {ConnectWithEmoji} from './ConnectWithEmoji';
import {Switch, Route} from 'react-router-dom';
import {useHistory} from 'react-router';
import {ConnectionFlowWrapper} from './ConnectionFlowWrapper';

export type ConnectModal = 'chooseMethod' | 'emoji' | 'recover';

export interface ConnectionFlowProps {
  walletService: WalletService;
  basePath: string;
  name: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ConnectionFlow = ({basePath = '', name, onCancel, onSuccess, walletService}: ConnectionFlowProps) => {
  const history = useHistory();

  const onConnectWithDeviceClick = () => {
    walletService.initializeConnection(name).then(() => {
      history.push(join(basePath, 'emoji'), {ensName: name});
    });
  };

  return <Switch>
    <Route exact path={join(basePath, 'chooseMethod')}>
      <ConnectionFlowWrapper progress={2} steps={4}>
        <ChooseConnectionMethod
          onConnectWithDeviceClick={onConnectWithDeviceClick}
          onConnectWithPassphraseClick={() => history.push(join(basePath, 'recover'), {ensName: name})}
          onCancel={onCancel}
        />
      </ConnectionFlowWrapper>
    </Route>
    <Route exact path={join(basePath, 'recover')}>
      <ConnectionFlowWrapper progress={3} steps={4}>
        <ConnectWithPassphrase
          name={name}
          walletService={walletService}
          onRecover={onSuccess}
          onCancel={() => history.goBack()}
        />
      </ConnectionFlowWrapper>
    </Route>
    <Route exact path={join(basePath, 'emoji')}>
      <ConnectionFlowWrapper progress={3} steps={4}>
        <ConnectWithEmoji
          walletService={walletService}
          onConnect={onSuccess}
          onCancel={onCancel}
        />
      </ConnectionFlowWrapper>
    </Route>
  </Switch>;
};
