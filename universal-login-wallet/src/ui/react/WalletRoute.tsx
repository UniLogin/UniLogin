import React from 'react';
import {Route, Redirect, RouteProps, RouteComponentProps} from 'react-router-dom';
import {getDefaultPathForWalletState} from '../../app/getDefaultPathForWalletState';
import {WalletState} from '@universal-login/sdk';

export interface WalletRouteProps extends RouteProps {
  walletState: WalletState;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export const WalletRoute = ({walletState, component, render, ...restProps}: WalletRouteProps) => (
  <Route
    {...restProps}
    render={props =>
      mapping[walletState.kind as 'None'].filter(path => props.location.pathname.includes(path)).length > 0
        ? React.createElement(component, props)
        : (<Redirect
          to={{
            pathname: getDefaultPathForWalletState(walletState.kind),
            state: {from: props.location},
          }}
        />)}
  />
);

const mapping = {
  'None': [
    '/welcome',
    '/privacy',
    '/terms',
    '/connect',
    '/selectDeployName',
  ],
  'Future': [
    '/create',
  ],
  'Deploying': [
    '/create',
  ],
  'Deployed': [
    '/wallet',
    '/connectionSuccess',
    '/creationSuccess',
  ],
  'Connecting': [
    '/connect',
  ]
}