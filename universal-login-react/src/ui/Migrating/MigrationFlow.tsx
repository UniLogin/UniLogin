import React from 'react';
import {Switch, useRouteMatch, Route, Redirect, useHistory} from 'react-router-dom';
import path from 'path';
import {WalletService} from '@unilogin/sdk';
import {EnterEmail} from './EnterEmail';

export interface MigrationFlowProps {
  walletService: WalletService;
  hideModal: () => void;
};

export const MigrationFlow = ({walletService, hideModal}: MigrationFlowProps) => {
  const match = useRouteMatch();
  const history = useHistory();

  return <Switch>
    <Route exact path={match.path}>
      <EnterEmail
        onConfirm={(email) => history.push(path.join(match.path, 'confirm'), {email})}
        hideModal={hideModal}
        walletService={walletService}
      />
    </Route>
    <Route exact path={path.join(match.path, 'confirm')}>
    </Route>
    <Redirect exact from={match.path} to={path.join(match.path, 'email')} />
  </Switch>
};
