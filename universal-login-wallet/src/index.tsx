import './ui/styles/main.sass';

import React from 'react';
import {render} from 'react-dom';
import App from './ui/react/App';
import {createServices, ServiceContext} from './ui/createServices';
import getConfig from './config/getConfig';
import {CustomBrowserRouter} from './ui/react/CustomBrowserRouter';
import {Spinner, ErrorBoundary, useAsync} from '@universal-login/react';
import {setBetaNotice} from '@universal-login/sdk';

const AppBootstrapper = () => {
  const [services] = useAsync(async () => {
    const config = getConfig();

    const services = createServices(config);
    await services.start();
    const {sdk} = services;
    setBetaNotice(sdk);
    return services;
  }, []);

  if (!services) {
    return <Spinner className="spinner-center"/>;
  }

  return (
    <ServiceContext.Provider value={services}>
      <CustomBrowserRouter>
        <ErrorBoundary>
          <App/>
        </ErrorBoundary>
      </CustomBrowserRouter>
    </ServiceContext.Provider>
  );
};

render(<AppBootstrapper/>, document.getElementById('app'));
