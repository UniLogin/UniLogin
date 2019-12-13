import React from 'react';
import {Provider} from 'web3/providers';
import {render} from 'react-dom';
import {Web3PickerComponent} from './Web3PickerComponent';
import {State} from 'reactive-properties';
import {ensure, ensureNotNull} from '@universal-login/commons';
import {waitForFalse} from '../../utils';
import {Web3ProviderFactory, universalLoginCustomProvider, metaMaskProvider} from '../../Web3ProviderFactory';

type OnPickProvider = (providerName?: Web3ProviderFactory) => void;

const setProviderForWeb3 = (provider: Provider) => {

}
export class Web3Picker implements Provider {
  private isVisible = new State(false);
  private created = false;
  private onPickProvider?: OnPickProvider = undefined;
  private providers: Web3ProviderFactory[] = [
    universalLoginCustomProvider,
  ];

  currentCustomProvider?: Web3ProviderFactory = undefined;

  get() {
    return this.getCurrentProvider();
  }

  constructor(
    private readonly defaultProvider: Provider,
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

  private getCustomProvider(name: string): Web3ProviderFactory {
    const customProvider = this.findCustomProvider(name);
    ensureNotNull(customProvider, Error, `Provider with given name(${name}) is not exist`);
    return customProvider;
  }

  private findCustomProvider = (name: string) => this.providers.find((customProvider) => customProvider.name === name);

  private getCurrentProvider() {
    if (!!this.currentCustomProvider) {
      return this.currentCustomProvider.create();
    } else {
      return this.defaultProvider;
    }
  }

  private lazyCreateReactRoot() {
    if (!this.created) {
      this.created = true;
      const root = this.createReactRoot('universal-login-web3-picker');
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
      waitForPick: () => waitForFalse(this.isVisible),
    }
  }

  async send() {
    const {waitForPick} = this.show();
    return waitForPick();
  }


  private createReactRoot(rootId: string, parentSelector = 'body') {
    const parentElement = document.querySelector(parentSelector);
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', rootId);
    parentElement!.appendChild(reactRoot);
    return reactRoot;
  }
}
