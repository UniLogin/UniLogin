import React from 'react';
import {Provider} from 'web3/providers';
import {render} from 'react-dom';
import {Web3PickerComponent} from './Web3PickerComponent';
import {State} from 'reactive-properties';
import {ULWeb3Provider} from '../../ULWeb3Provider';
import {ensure, ensureNotNull} from '@universal-login/commons';
import {Network, getConfigForNetwork} from '../../config';
import {MetamaskEthereum} from '../../models/metamask';

export interface CustomProvider {
  getProvider: (network: Network) => Provider | MetamaskEthereum;
  icon: string;
  name: string;
}

const universalLoginCustomProvider: CustomProvider = {
  name: 'UniversalLogin',
  icon: 'UniversalLogin logo',
  getProvider: (network) => new ULWeb3Provider(getConfigForNetwork(network)),
};

const metaMaskProvider: CustomProvider = {
  name: 'MetaMask',
  icon: 'MetaMask logo',
  getProvider: () => {
    ensureNotNull(window.ethereum, Error, 'MetaMask is not enabled');
    return window.ethereum;
  },
};

export class Web3Picker {
  private isVisible = new State(false);
  private created = false;
  private providers: CustomProvider[] = [
    universalLoginCustomProvider,
  ];

  currentProviderName?: string = undefined;

  constructor(
    private onPickProvider?: (providerName: CustomProvider) => void,
    private network: Network = 'mainnet',
    private parentSelector?: string,
  ) {
    if (window.ethereum) {
      this.providers = this.providers.concat(metaMaskProvider);
    }
  }

  getProviders() {
    return this.providers;
  }

  setProvider(providerName: string) {
    ensure(this.providers.some(({name}) => name === providerName), Error, `Provider is not exist. Invalid name: ${providerName}`);
    this.currentProviderName = providerName;
    const currentCustomProvider = this.getCustomProvider(providerName);
    this.onPickProvider?.(currentCustomProvider);
  }

  private getCustomProvider(name: string): CustomProvider {
    const customProvider = this.findCustomProvider(name);
    ensureNotNull(customProvider, Error, `Provider with given name(${name}) is not exist`);
    return customProvider;
  }

  private findCustomProvider = (name: string) => this.providers.find((customProvider) => customProvider.name === name);

  getCurrentProvider() {
    ensureNotNull(this.currentProviderName, Error, 'Provider is not picked');
    const currentCustomProvider = this.getCustomProvider(this.currentProviderName);
    return currentCustomProvider.getProvider(this.network);
  }

  lazyCreateReactRoot() {
    if (!this.created) {
      this.created = true;
      const root = this.createReactRoot('universal-login-web3-picker', this.parentSelector);
      render(
        <Web3PickerComponent
          isVisibleProp={this.isVisible}
          hideModal={() => this.hideChooser()}
          setProvider={this.setProvider.bind(this)}
          customProviders={this.providers}
        />, root);
    }
  }

  private hideChooser() {
    this.isVisible.set(false);
  }

  show() {
    this.lazyCreateReactRoot();
    this.isVisible.set(true);
  }

  private createReactRoot(rootId: string, parentSelector = 'body') {
    const parentElement = document.querySelector(parentSelector);
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', rootId);
    parentElement!.appendChild(reactRoot);
    return reactRoot;
  }
}
