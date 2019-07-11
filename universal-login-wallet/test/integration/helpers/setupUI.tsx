import React from 'react';
import {utils} from 'ethers';
import {getWallets} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import App from '../../../src/ui/react/App';
import {AppPage} from '../pages/AppPage';
import {mountWithContext} from './CustomMount';
import {createPreconfiguredServices} from './ServicesUnderTests';

export const setupUI = async (relayer: Relayer, tokenAddress?: string) => {
  const name = 'name.mylogin.eth';
  const [wallet] = await getWallets(relayer.provider);
  const tokens = tokenAddress ? [tokenAddress, ETHER_NATIVE_TOKEN.address] : [ETHER_NATIVE_TOKEN.address];
  const services = await createPreconfiguredServices(relayer.provider, relayer, tokens);
  services.tokenService.start();
  services.balanceService.start();

  const [privateKey, contractAddress] = await services.sdk.create(name);
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  services.walletService.connect({name, contractAddress, privateKey});
  const appWrapper = mountWithContext(<App/>, services, ['/']);
  const appPage = new AppPage(appWrapper);
  await appPage.login().waitForHomeView('2.0');
  return {appPage, services, contractAddress, appWrapper};
};
