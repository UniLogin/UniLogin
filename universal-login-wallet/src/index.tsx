import './styles/style.sass';

import React from 'react';
import { render } from 'react-dom';
import App from './ui/App';
import Services from './services/Services';


const services = Services({
  jsonRpcUrl: 'http://rinkeby.infura.io',
  relayerUrl: 'https://relayer.universallogin.io/',
});

render(
  <App services={services}/>,
  document.getElementById('app'),
);
