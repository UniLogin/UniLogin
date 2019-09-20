import './ui/styles/main.sass';

import React from 'react';
import {render} from 'react-dom';
import App from './ui/react/App';
import {createServices, ServiceContext} from './ui/createServices';
import getConfig from './config/getConfig';
import {CustomBrowserRouter} from './ui/react/CustomBrowserRouter';
import {ErrorBoundary} from '@universal-login/react';


const start = async () => {
  const config = getConfig();
  const services = createServices(config);
  const relayerConfig = await services.getRelayerConfig();
  await services.start();

  render(
    <ServiceContext.Provider value={services}>
        <CustomBrowserRouter>
          <ErrorBoundary>
            <App relayerConfig={relayerConfig} />
          </ErrorBoundary>
        </CustomBrowserRouter>
    </ServiceContext.Provider>,
    document.getElementById('app'),
  );
};

// tslint:disable-next-line: no-floating-promises
start();
