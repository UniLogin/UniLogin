import React from 'react';
import {Provider, JsonRPCResponse, Callback} from 'web3/providers';
import {render} from 'react-dom';
import {Web3PickerComponent} from './Web3PickerComponent';
import {State} from 'reactive-properties';
import {ensure, ensureNotNull} from '@universal-login/commons';
import {waitForFalse} from '../../utils';
import {Web3ProviderFactory, metaMaskProviderFactory} from '../../Web3ProviderFactory';
import {Web3Strategy} from '../../Web3Strategy';
import {JsonRPCRequest} from '../../models/rpc';

export class Web3Picker implements Provider {
  private isVisible = new State(false);
  private created = false;

  constructor(
    private web3Strategy: Web3Strategy,
    private readonly factories: Web3ProviderFactory[],
  ) {
    if (window.ethereum) {
      this.factories = this.factories.concat(metaMaskProviderFactory);
    }
  }

  private hasProvider = (providerName: string) => this.factories.some(({name}) => name === providerName)

  setProvider(providerName: string) {
    ensure(this.hasProvider(providerName), Error, `Provider does not exist. Invalid name: ${providerName}`);
    this.web3Strategy.currentProvider = this.getCustomProvider(providerName).create();
    this.isVisible.set(false);
  }

  private getCustomProvider(name: string): Web3ProviderFactory {
    const customProvider = this.findCustomProvider(name);
    ensureNotNull(customProvider, Error, `Provider with given name(${name}) is not exist`);
    return customProvider;
  }

  private findCustomProvider = (name: string) => this.factories.find((customProvider) => customProvider.name === name);

  private lazyCreateReactRoot() {
    if (!this.created) {
      this.created = true;
      const root = this.createReactRoot('universal-login-web3-picker');
      render(
        <Web3PickerComponent
          isVisibleProp={this.isVisible}
          hideModal={() => this.hideChooser()}
          setProvider={this.setProvider.bind(this)}
          customProviders={this.factories}
        />, root);
    }
  }

  private hideChooser() {
    this.isVisible.set(false);
  }

  show() {
    this.lazyCreateReactRoot();
    this.isVisible.set(true);
    return {
      waitForPick: () => waitForFalse(this.isVisible),
    };
  }

  async send(jsonRpcReq: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    const {waitForPick} = this.show();
    await waitForPick();
    return this.web3Strategy.currentProvider.send(jsonRpcReq, callback);
  }

  private createReactRoot(rootId: string, parentSelector = 'body') {
    const parentElement = document.querySelector(parentSelector);
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', rootId);
    parentElement!.appendChild(reactRoot);
    return reactRoot;
  }
}
