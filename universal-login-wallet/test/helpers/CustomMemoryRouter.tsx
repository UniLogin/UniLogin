import React, {ReactNode} from 'react';
import {MemoryRouter, Route, RouteComponentProps} from 'react-router-dom';
import {RouterContext} from '../../src/ui/CustomBrowserRouter';

export interface CustomMemoryRouterProps {
  children: ReactNode;
  initialEntries: any;
}

export const CustomMemoryRouter = ({children, initialEntries}: CustomMemoryRouterProps) => {
  return(
    <MemoryRouter initialEntries={initialEntries}>
      <Route>
        {(routeProps: RouteComponentProps) => (
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </MemoryRouter>
  );
};
