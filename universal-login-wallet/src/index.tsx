import './styles/main.sass';

import React from 'react';
import { render } from 'react-dom';
import App from './ui/App';
import createServices from './services/Services';
import config from './config/config';

const services = createServices(config);

render(
  <App services={services}/>,
  document.getElementById('app'),
);
