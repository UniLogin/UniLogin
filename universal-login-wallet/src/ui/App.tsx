import React, {useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import HomeScreen from './Home/HomeScreen';
import ProgressScreen from './Login/ProgressScreen';
import NotFound from './NotFound';
import Login from './Login/Login';
import {PrivateRoute} from './PrivateRoute';
import NotificationsScreen from './Notifications/NotificationsScreen';

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
            <HomeScreen/>
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
        <PrivateRoute
          path="/notifications"
          authorized={authorized}
          render={
            () =>
            <NotificationsScreen />
          }
        />
        <Route component={NotFound}/>
      </Switch>
  );
};

export default App;
