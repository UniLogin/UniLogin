import React, {useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import HomeScreen from './Home/HomeScreen';
import ProgressScreen from './Login/ProgressScreen';
import NotFound from './NotFound';
import Login from './Login/Login';
import {PrivateRoute} from './PrivateRoute';
import NotificationsScreen from './Notifications/NotificationsScreen';
import ApproveScreen from './Login/ApproveScreen';
import RecoveryScreen from './Login/RecoveryScreen';
import SettingsScreen from './Settings/SettingsScreen';

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
        <Route
          exact
          path="/approve"
          render={() => <ApproveScreen />}
        />
        <Route
          exact
          path="/recovery"
          render={() => <RecoveryScreen />}
        />
        <PrivateRoute
          authorized={authorized}
          exact
          path="/"
          render={
            () =>
            <HomeScreen setUnauthorized={() => setAuthorized(false)}/>
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
        <PrivateRoute
          path="/settings"
          authorized={authorized}
          render={() => <SettingsScreen />}
        />
        <Route component={NotFound}/>
      </Switch>
  );
};

export default App;
