import React from 'react';
import {render} from 'react-dom';
import {App, AppProps} from './App';

export function initUi(props: AppProps) {
  const reactRootElement = createReactRoot();
  render(<App {...props}/>, reactRootElement);

}

function createReactRoot() {
  const reactRoot = document.createElement('div');
  reactRoot.setAttribute('id', 'universal-login-modal-root');
  document.getElementsByTagName('body')[0].appendChild(reactRoot);
  return reactRoot;
}
