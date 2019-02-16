import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import WyreComponent from './WyreComponent';
import NotFound from './NotFound';
import {Services} from '../services/Services';
import Login from './Login/Login';

interface AppProps {
  services: Services;
}

const App = (props: AppProps) => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" render={() => <Login services={props.services}/>}/>
        <Route exact path="/" component={Dashboard}/>
        <Route path="/WyreComponent" component={WyreComponent}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
