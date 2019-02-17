import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from './NotFound';
import {Services} from '../services/Services';
import ContentContainer from './ContentContainer';

interface AppProps {
  services: Services;
}

const App = (props: AppProps) => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <ContentContainer services={props.services}/>}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
