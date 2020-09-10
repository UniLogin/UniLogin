import React from 'react';
import {Route, Redirect, RouteProps, RouteComponentProps, useLocation} from 'react-router-dom';
import {getDefaultPathForWalletState} from '../../app/getDefaultPathForWalletState';
import {WalletService} from '@unilogin/sdk';
import {needRedirect} from '../../app/needRedirect';

export interface WalletRouteProps extends RouteProps {
  walletService: WalletService;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export const WalletRoute = ({walletService, component, render, ...restProps}: WalletRouteProps) => {
  const location = useLocation();
  return needRedirect(walletService.state, location.pathname)
    ? <Redirect
      from={location.pathname}
      to={{
        pathname: getDefaultPathForWalletState(walletService.state),
        state: {from: location},
      }} />
    : <Route
      {...restProps}
      render={props => React.createElement(component, {...props, walletState: walletService.state})}
    />;
};
