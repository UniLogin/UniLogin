import './styles/main.sass';

import React from 'react';
import { render } from 'react-dom';
import App from './ui/App';
import createServices from './services/Services';


const services = createServices({
  jsonRpcUrl: 'https://rinkeby.infura.io',
  relayerUrl: 'https://relayer.universallogin.io',
  domains: ['my-id.test'],
});

render(
  <App services={services}/>,
  document.getElementById('app'),
);
