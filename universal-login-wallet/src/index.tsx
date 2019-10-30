import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {setBetaNotice} from '@universal-login/sdk';
import {ErrorBoundary, useAsync} from '@universal-login/react';
import App from './ui/react/App';
import {createServices, ServiceContext} from './ui/createServices';
import getConfig from './config/getConfig';
import './ui/styles/main.sass';
import Logo from './ui/assets/logo.svg';

const AppBootstrapper = () => {
  const [services, err] = useAsync(async () => {
    const config = getConfig();

    const services = createServices(config);
    await services.start();

    services.walletService.loadFromStorage();
    setBetaNotice(services.sdk);

    return services;
  }, []);

  if (err) {
    throw err;
  }

  if (!services) {
    return (
      <div id="preloader">
        <img src={Logo} className="preloader_img" />
      </div>
    );
  }

  return (
    <ServiceContext.Provider value={services}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ServiceContext.Provider>
  );
};

render(
  <ErrorBoundary>
    <AppBootstrapper />
  </ErrorBoundary>, document.getElementById('app'));
