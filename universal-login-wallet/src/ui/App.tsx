import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Dogs from './Dogs';
import NotFound from './NotFound';
import Login from './Login/Login';
import {CustomBrowserRouter} from '../services/CustomRouter';

const App = () => {
  return(
    <CustomBrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/" component={Dashboard}/>
        <Route path="/dogs" component={Dogs}/>
        <Route component={NotFound}/>
      </Switch>
    </CustomBrowserRouter>
  );
};

export default App;
