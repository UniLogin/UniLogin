import React, {useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import ProgressScreen from './Login/ProgressScreen';
import NotFound from './NotFound';
import Login from './Login/Login';
import {PrivateRoute} from './PrivateRoute';

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  return(
      <Switch>
        <Route
          exact
          path="/login"
          render={props =>
              <Login
                {...props}
                setAuthorized={() => setAuthorized(true)}
              />
          }
        />
        <PrivateRoute
          authorized={authorized}
          exact
          path="/"
          render={
            () =>
            <Dashboard/>
          }
        />
        <PrivateRoute
          path="/transferring"
          authorized={authorized}
          render={
            () =>
            <ProgressScreen/>
          }
        />
        <Route component={NotFound}/>
      </Switch>
  );
};

export default App;
