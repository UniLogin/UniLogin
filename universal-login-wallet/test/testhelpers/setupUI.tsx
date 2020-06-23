import React from 'react';
import {Wallet} from 'ethers';
import Relayer from '@unilogin/relayer';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {createAndSetWallet} from '@unilogin/sdk/testutils';
import App from '../../src/ui/react/App';
import {AppPage} from '../pages/AppPage';
import {mountWithContext} from './CustomMount';
import {createPreconfiguredServices} from './ServicesUnderTests';

export const setupUI = async (relayer: Relayer, wallet: Wallet, tokenAddress?: string) => {
  const name = 'name.mylogin.eth';
  const tokens = tokenAddress ? [tokenAddress, ETHER_NATIVE_TOKEN.address] : [ETHER_NATIVE_TOKEN.address];
  const services = await createPreconfiguredServices(relayer.provider, relayer, tokens);
  const {contractAddress} = await createAndSetWallet(name, services.walletService, wallet, services.sdk);
  const appWrapper = mountWithContext(<App/>, services, ['/dashboard']);
  const appPage = new AppPage(appWrapper);
  await appPage.login().waitForHomeView('$1.98');
  return {appPage, services, contractAddress, appWrapper};
};
