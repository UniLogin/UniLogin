import './styles/main.sass';

import React from 'react';
import {render} from 'react-dom';
import App from './ui/App';
import {createServices, ServiceContext} from './services/Services';
import getConfig from '../config/getConfig';
import {CustomBrowserRouter} from './ui/CustomBrowserRouter';

const config = getConfig();

const services = createServices(config);
services.tokenService.start();
services.balanceService.start();
services.sdk.start();

render(
  <ServiceContext.Provider value={services}>
    <CustomBrowserRouter>
      <App/>
    </CustomBrowserRouter>
  </ServiceContext.Provider>,
  document.getElementById('app'),
);
