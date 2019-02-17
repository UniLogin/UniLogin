import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
//import WyreComponent from './WyreComponent';
import Wyre from './Wyre';
import NotFound from './NotFound';
import {Services} from '../services/Services';
import Login from './Login/Login';
import ContentContainer from './ContentContainer';

interface AppProps {
  services: Services;
}

const App = (props: AppProps) => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" render={() => <Login services={props.services}/>}/>
        <Route exact path="/" render={() => <ContentContainer services={props.services}/>}/>
        <Route exact path="/Dashboard" component={Dashboard}/>
        <Route path="/Wyre" component={Wyre}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
