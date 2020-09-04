
import React from 'react';
import path from 'path';
import {useRouteMatch, useHistory, Switch, Route, Redirect} from 'react-router-dom';
import {WalletService} from '@unilogin/sdk';
import {EnterEmail} from './EnterEmail';
import {CreatePassword} from '../Onboarding/CreatePassword';
import {ConfirmCodeScreen} from '../Onboarding/ConfirmCodeScreen';
import {MigrationSuccess} from './MigrationSuccess';

export interface MigrationFlowProps {
  walletService: WalletService;
  onSuccess: () => void;
  hideModal: () => void;
  onError?: (e: Error) => void;
};

export const MigrationFlow = ({walletService, onSuccess, hideModal, onError}: MigrationFlowProps) => {
  const match = useRouteMatch();
  const history = useHistory();

  return (
    <Switch>
      <Route exact path={path.join(match.path, 'email')}>
        <EnterEmail
          onConfirm={async (email) => {
            try {
              const promise = walletService.createRequestedMigratingWallet(email);
              history.replace(path.join(match.path, 'confirm'));
              await promise;
            } catch (e) {
              onError?.(e);
            }
          }}
          hideModal={hideModal}
          walletService={walletService}
        />;
      </Route>
      <Route exact path={path.join(match.path, 'confirm')}>
        <ConfirmCodeScreen
          onConfirmCode={() => history.replace(path.join(match.path, 'password'))}
          onCancel={() => {
            history.replace(path.join(match.path, 'email'));
            walletService.migrationRollback();
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
            history.replace(path.join(match.path, 'success'));
          }}
        />
      </Route>
      <Route exact path={path.join(match.path, 'success')}>
        <MigrationSuccess
          walletService={walletService}
          hideModal={hideModal}
          onConfirm={onSuccess}
        />
      </Route>
      <Redirect exact from={match.path} to={path.join(match.path, 'email')} />
    </Switch>
  );
};
