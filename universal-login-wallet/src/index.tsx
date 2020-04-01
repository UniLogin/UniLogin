import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ErrorBoundary, useAsync, ThemeProvider} from '@unilogin/react';
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

    await services.walletService.loadFromStorage();
    return services;
  }, []);

  if (err) {
    throw err;
  }

  if (!services) {
    return (
      <div id="preloader">
        <img src={Logo} className="preloaderImg" />
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
  <ThemeProvider theme={'jarvis'}>
    <ErrorBoundary>
      <AppBootstrapper />
    </ErrorBoundary>
  </ThemeProvider>, document.getElementById('app'));
