import './ui/styles/main.sass';

import React from 'react';
import {render} from 'react-dom';
import App from './ui/react/App';
import {createServices, ServiceContext} from './ui/createServices';
import getConfig from './config/getConfig';
import {CustomBrowserRouter} from './ui/react/CustomBrowserRouter';
import {ErrorBoundary} from './ui/react/ErrorBoundary';

const config = getConfig();

const services = createServices(config);
services.start();

render(
  <ServiceContext.Provider value={services}>
      <CustomBrowserRouter>
        <ErrorBoundary>
          <App/>
        </ErrorBoundary>
      </CustomBrowserRouter>
  </ServiceContext.Provider>,
  document.getElementById('app'),
);
