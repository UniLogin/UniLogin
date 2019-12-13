import React from 'react';
import {Provider} from 'web3/providers';
import {render} from 'react-dom';
import {Web3PickerComponent} from './Web3PickerComponent';
import {State, waitFor} from 'reactive-properties';
import {ULWeb3Provider} from '../../ULWeb3Provider';
import {ensure, ensureNotNull} from '@universal-login/commons';
import {Network, getConfigForNetwork} from '../../config';
import {waitForFalse} from '../../utils';

export interface CustomProvider {
  getProvider: (network: Network) => Provider;
  icon: string;
  name: string;
}

export const universalLoginCustomProvider: CustomProvider = {
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

type OnPickProvider = (providerName?: CustomProvider) => void;

export class Web3Picker {
  private isVisible = new State(false);
  private created = false;
  private onPickProvider?: OnPickProvider = undefined;
  private providers: CustomProvider[] = [
    universalLoginCustomProvider,
  ];

  currentCustomProvider?: CustomProvider = undefined;

  get currentProvider() {
    return this.getCurrentProvider();
  }

  constructor(
    private readonly defaultProvider: Provider,
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
    this.currentCustomProvider = this.getCustomProvider(providerName)
    this.onPickProvider?.(this.currentCustomProvider);
  }

  private getCustomProvider(name: string): CustomProvider {
    const customProvider = this.findCustomProvider(name);
    ensureNotNull(customProvider, Error, `Provider with given name(${name}) is not exist`);
    return customProvider;
  }

  private findCustomProvider = (name: string) => this.providers.find((customProvider) => customProvider.name === name);

  private getCurrentProvider() {
    if (!!this.currentCustomProvider) {
      return this.currentCustomProvider.getProvider(this.network);
    } else {
      return this.defaultProvider;
    }
  }

  private lazyCreateReactRoot() {
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

  setOnPickProvider(onPickProvider: OnPickProvider) {
    this.onPickProvider = onPickProvider;
  }

  show() {
    this.lazyCreateReactRoot();
    this.isVisible.set(true);
    return {
      waitForPick: waitForFalse(this.isVisible),
    }
  }


  private createReactRoot(rootId: string, parentSelector = 'body') {
    const parentElement = document.querySelector(parentSelector);
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', rootId);
    parentElement!.appendChild(reactRoot);
    return reactRoot;
  }
}
