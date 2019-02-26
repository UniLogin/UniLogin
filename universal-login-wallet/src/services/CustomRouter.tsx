import React from "react";
import {BrowserRouter, Route, RouteComponentProps} from "react-router-dom";

export const RouterContext = React.createContext({} as RouteComponentProps);

export const CustomBrowserRouter = ({children}: any) => {
  return(
    <BrowserRouter>
      <Route>
        {(routeProps: any) => (
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </BrowserRouter>
  )
}
