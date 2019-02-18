import './styles/main.sass';

import React from 'react';
import { render } from 'react-dom';
import App from './ui/App';
import createServices from './services/Services';
import getConfig from '../config/getConfig';

const config = getConfig();
console.log(process.env.NODE_ENV)
console.log(config);

const services = createServices(config);

render(
  <App services={services}/>,
  document.getElementById('app'),
);
