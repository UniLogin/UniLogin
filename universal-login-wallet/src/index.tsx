import './styles/main.sass';

import React from 'react';
import { render } from 'react-dom';
import App from './ui/App';
import createServices from './services/Services';


const services = createServices({
  jsonRpcUrl: 'http://rinkeby.infura.io',
  relayerUrl: 'https://relayer.universallogin.io/',
});

render(
  <App services={services}/>,
  document.getElementById('app'),
);
