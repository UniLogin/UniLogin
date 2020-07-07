import React from 'react';
import {render} from 'react-dom';
import {ErrorBoundary, ThemeProvider} from '@unilogin/react';
import './ui/styles/main.sass';
import Logo from './ui/assets/logo.svg';
import {OpenSeaPort, Network} from 'opensea-js';
import ULIFrameProvider from '@unilogin/provider';

const AppBootstrapper = () => {
  const ulProvider = ULIFrameProvider.create('rinkeby');
  const seaport = new OpenSeaPort(ulProvider, {networkName: Network.Rinkeby});
  const sellItem = async () => {
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
    try {
      const order = await seaport.createSellOrder({
        asset: {
          tokenId: '589',
          tokenAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        },
        accountAddress: '0x5A984bA07533440121ac5f54318539FfA9b69e31',
        startAmount: 3,
        // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
        endAmount: 2,
        expirationTime,
      });
      console.log({order})
    } catch (e) {
      console.log('error', e)
    }
  }

  return (<>
    <button id="unilogin-button" />
    <button style={{border: 'slolid 1px grey'}} onClick={sellItem}>Sell item</button>
  </>);
};

render(
  <ThemeProvider theme={'jarvis'}>
    <ErrorBoundary>
      <AppBootstrapper />
    </ErrorBoundary>
  </ThemeProvider>, document.getElementById('app'));
