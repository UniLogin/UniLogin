import {join} from 'path';
import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {ChooseConnectionMethod} from './ChooseConnectionMethod';
import {ConnectWithPassphrase} from './ConnectWithPassphrase';
import {ConnectWithEmoji} from './ConnectWithEmoji';
import {Switch, Route} from 'react-router-dom';
import {useHistory} from 'react-router';

export type ConnectModal = 'chooseMethod' | 'emoji' | 'recover';

export interface ConnectionFlowProps {
  basePath: string;
  name: string;
  onCancel: () => void;
  onSuccess: () => void;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  className?: string;
}

export const ConnectionFlow = ({basePath = '', name, onCancel, onSuccess, sdk, walletService, className}: ConnectionFlowProps) => {
  const history = useHistory();

  const onConnectWithDeviceClick = () => {
    walletService.initializeConnection(name).then(() => {
      history.push('/connect/emoji');
    });
  };

  return <Switch>
    <Route exact path={join(basePath, 'chooseMethod')}>
      <ChooseConnectionMethod
        onConnectWithDeviceClick={onConnectWithDeviceClick}
        onConnectWithPassphraseClick={() => history.push(join(basePath, 'recover'))}
        onCancel={onCancel}
        className={className}
      />
    </Route>
    <Route exact path={join(basePath, 'recover')}>
      <ConnectWithPassphrase
        name={name}
        walletService={walletService}
        onRecover={onSuccess}
        className={className}
        onCancel={() => history.push(join(basePath, 'chooseMethod'))}
      />
    </Route>
    <Route exact path={join(basePath, 'emoji')}>
      <ConnectWithEmoji
        name={name}
        sdk={sdk}
        walletService={walletService}
        onConnect={onSuccess}
        onCancel={() => history.push(join(basePath))}
        className={className}
      />
    </Route>
  </Switch>;
};
