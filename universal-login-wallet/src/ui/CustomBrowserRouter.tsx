import React, {ReactNode} from 'react';
import {BrowserRouter, Route, RouteComponentProps} from 'react-router-dom';

export const RouterContext = React.createContext({} as RouteComponentProps);

export interface CustomBrowserRouterProps {
  children: ReactNode;
}

export const CustomBrowserRouter = ({children}: CustomBrowserRouterProps) => {
  return(
    <BrowserRouter>
      <Route>
        {(routeProps: RouteComponentProps) => (
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </BrowserRouter>
  );
};
