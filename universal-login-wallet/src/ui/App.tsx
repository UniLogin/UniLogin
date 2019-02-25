import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import ProgressScreen from './Login/ProgressScreen';
import NotFound from './NotFound';
import Login from './Login/Login';
import {CustomBrowserRouter} from './CustomBrowserRouter';

const App = () => {
  return(
    <CustomBrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/" component={Dashboard}/>
        <Route path="/transferring" component={ProgressScreen}/>
        <Route component={NotFound}/>
      </Switch>
    </CustomBrowserRouter>
  );
};

export default App;
