
import React from 'react';
import path from 'path';
import {useRouteMatch, useHistory, Switch, Route, Redirect} from 'react-router-dom';
import {WalletService} from '@unilogin/sdk';
import {EnterEmail} from './EnterEmail';
import {CreatePassword} from '../Onboarding/CreatePassword';
import {ConfirmCodeScreen} from '../Onboarding/ConfirmCodeScreen';

export interface MigrationFlowProps {
  walletService: WalletService;
  onSuccess: () => void;
  hideModal: () => void;
};

export const MigrationFlow = ({walletService, onSuccess, hideModal}: MigrationFlowProps) => {
  const match = useRouteMatch();
  const history = useHistory();

  return (
    <Switch>
      <Route exact path={path.join(match.path, 'email')}>
        <EnterEmail
          onConfirm={async (email) => {
            history.push(path.join(match.path, 'confirm'));
            await walletService.createRequestedMigratingWallet(email);
          }}
          hideModal={hideModal}
          walletService={walletService}
        />;
      </Route>
      <Route exact path={path.join(match.path, 'confirm')}>
        <ConfirmCodeScreen
          onConfirmCode={() => history.push(path.join(match.path, 'password'))}
          onCancel={() => {
            walletService.migrationRollback();
            history.push(path.join(match.path, 'email'));
          }}
          walletService={walletService}
        />
      </Route>
      <Route exact path={path.join(match.path, 'password')}>
        <CreatePassword
          walletService={walletService}
          hideModal={hideModal}
          onConfirm={async (password) => {
            await walletService.createPassword(password);
            onSuccess();
          }}
        />
      </Route>
      <Redirect exact from={match.path} to={path.join(match.path, 'email')} />
    </Switch>
  );
};
