import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Dogs from './Dogs';
import NotFound from './NotFound';
import {Services} from '../services/Services';
import Login from './Login/Login';

interface AppProps {
  services: Services;
}

const App = ({services}: AppProps) => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" render={() => <Login services={services}/>}/>
        <Route exact path="/" render={() => <Dashboard services={services}/>}/>
        <Route path="/dogs" component={Dogs}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
