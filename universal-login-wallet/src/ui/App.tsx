import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Dogs from './Dogs';
import NotFound from './NotFound';
import {Services} from '../services/Services';

interface AppProps {
  services: Services;
}

const App = ({services} : AppProps) => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Dashboard}/>
      <Route path="/dogs" component={Dogs}/>
      <Route component={NotFound}/>
    </Switch>
  </BrowserRouter>
);

export default App;
