import React from 'react';
import {getWallets} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import App from '../../../src/ui/react/App';
import {AppPage} from '../pages/AppPage';
import {mountWithContext} from './CustomMount';
import {createPreconfiguredServices} from './ServicesUnderTests';
import {createAndSetWallet} from './createWallet';

export const setupUI = async (relayer: Relayer, tokenAddress?: string) => {
  const name = 'name.mylogin.eth';
  const [wallet] = await getWallets(relayer.provider);
  const tokens = tokenAddress ? [tokenAddress, ETHER_NATIVE_TOKEN.address] : [ETHER_NATIVE_TOKEN.address];
  const services = await createPreconfiguredServices(relayer.provider, relayer, tokens);
  await services.sdk.tokensDetailsStore.fetchTokensDetails();
  const {contractAddress} = await createAndSetWallet(name, services.sdk, wallet, services.walletService);
  const appWrapper = mountWithContext(<App/>, services, ['/']);
  const appPage = new AppPage(appWrapper);
  await appPage.login().waitForHomeView('1.9999999999995');
  return {appPage, services, contractAddress, appWrapper};
};
