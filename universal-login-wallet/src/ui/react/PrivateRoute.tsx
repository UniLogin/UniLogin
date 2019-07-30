import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';

export interface PrivateRouteProps extends RouteProps {
  authorized: boolean;
  render: ((props: RouteComponentProps<any>) => React.ReactNode);
}

export const PrivateRoute = ({ authorized, render, ...restProps }: PrivateRouteProps) => (
  <Route
    {...restProps}
    render={props => (
      authorized
        ? render(props)
        : (
          <Redirect
            to={{
              pathname: '/welcome',
              state: { from: props.location},
            }}
          />
        )
    )}
  />
);
