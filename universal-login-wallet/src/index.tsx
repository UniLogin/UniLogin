import './styles/main.sass';

import React from 'react';
import {render} from 'react-dom';
import App from './ui/App';
import {createServices, ServiceContext} from './services/Services';
import getConfig from '../config/getConfig';

const config = getConfig();

const services = createServices(config);
services.tokenService.start();

render(
  <ServiceContext.Provider value={services}>
    <App/>
  </ServiceContext.Provider>,
  document.getElementById('app'),
);
