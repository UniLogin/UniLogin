import React from 'react';
import {render} from 'react-dom';
import App from './App';
import config from './config';
import {createServices, ServiceContext} from './core/services/createServices';

const services = createServices(config);
services.sdk.start();

render((
    <ServiceContext.Provider value={services}>
      <App/>
    </ServiceContext.Provider>
  ),
  document.getElementById('app')
);
