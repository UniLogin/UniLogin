import React from 'react';
import {Route, Redirect, RouteProps, RouteComponentProps} from 'react-router-dom';
import {getDefaultPathForWalletState} from '../../app/getDefaultPathForWalletState';
import {WalletState} from '@universal-login/sdk';
import {needRedirect} from '../../app/needRedirect';

export interface WalletRouteProps extends RouteProps {
  walletState: WalletState;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export const WalletRoute = ({walletState, component, render, ...restProps}: WalletRouteProps) => (
  <Route
    {...restProps}
    render={props => needRedirect(walletState, props.location.pathname)
      ? (<Redirect
        to={{
          pathname: getDefaultPathForWalletState(walletState),
          state: {from: props.location},
        }}
      />)
      : React.createElement(component, props)}
  />
);
