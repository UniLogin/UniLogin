import React from 'react';
import {Provider} from 'web3/providers';
import {render} from 'react-dom';
import {createReactRoot} from '../utils/initUi';
import {Web3PickerComponent} from './Web3PickerComponent';
import {State} from 'reactive-properties';

export interface CustomProvider {
  getProvider: (provider: Provider) => Provider,
  icon: string,
  name: string,
}

export class Web3Picker {
  private isVisible = new State(false);
  private created = false;

  constructor(private parentSelector?: string) {}

  lazyCreateReactRoot() {
    if (!this.created) {
      this.created = true;
      const root = this.createReactRoot('universal-login-web3-picker', this.parentSelector);
      render(<Web3PickerComponent isVisibleProp={this.isVisible} hideModal={() => this.hideChooser()}/>, root);
    }
  }

  private hideChooser() {
    this.isVisible.set(false);
  }

  show() {
    this.lazyCreateReactRoot();
    this.isVisible.set(true);
  }

  private createReactRoot(rootId: string, parentSelector: string = 'body') {
    const parentElement = document.querySelector(parentSelector);
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', rootId);
    parentElement!.appendChild(reactRoot);
    return reactRoot;
  }
}
