import React from 'react';
import {render} from 'react-dom';
import {ULWeb3Root, ULWeb3RootProps} from '../react/ULWeb3Root';
import {ThemeProvider} from '@universal-login/react';

export function initUi(props: ULWeb3RootProps) {
  const reactRootElement = createReactRoot();
  render(
    <ThemeProvider theme="unilogin">
      <ULWeb3Root {...props} />
    </ThemeProvider>, reactRootElement);
}

export function createReactRoot(rootId = 'universal-login-modal-root') {
  const reactRoot = document.createElement('div');
  reactRoot.setAttribute('id', rootId);
  document.getElementsByTagName('body')[0].appendChild(reactRoot);
  return reactRoot;
}
