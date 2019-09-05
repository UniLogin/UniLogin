import React from 'react';
import {render} from 'react-dom';
import App from './App';

export function initUi() {
  const reactRootElement = createReactRoot();
  render(<App/>, reactRootElement);

}

function createReactRoot() {
  const reactRoot = document.createElement('div');
  reactRoot.setAttribute('id', 'universal-login-modal-root');
  document.getElementsByTagName('body')[0].appendChild(reactRoot);
  return reactRoot;
}
