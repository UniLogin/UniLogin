import './styles/main.sass';

import React from 'react';
import {render} from 'react-dom';
import App from './ui/App';
import {createServices, ServiceContext} from './services/Services';
import getConfig from '../config/getConfig';

const config = getConfig();

const services = createServices(config);

render(
  <ServiceContext.Provider value={services}>
    <App services={services}/>
  </ServiceContext.Provider>,
  document.getElementById('app'),
);
