import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Dogs from './Dogs';
import Navigation from './Navigation';
import NotFound from './NotFound';
import {Services} from '../services/Services';

interface AppProps {
  services: Services
}

const App = ({services} : AppProps) => (
  <BrowserRouter>
    <div>
    {console.log(services)}
      <Navigation />
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/dogs' component={Dogs}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
