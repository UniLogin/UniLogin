import React from 'react';
import {render} from 'react-dom';
import {ULWeb3Root, ULWeb3RootProps} from './react/ULWeb3Root';
import {isPrivateMode, isLocalStorageBlocked, ThemeProvider} from '@unilogin/react';
import './styles/index.css';
import {IWeb3PickerComponentProps, Web3PickerComponent} from './react/Web3PickerComponent';

export function initUi(props: ULWeb3RootProps) {
  const reactRootElement = createReactRoot();
  isPrivateMode().then((isPrivate: boolean) => !!isPrivate && alert('Warning! Please do not use incognito mode. You can lose all your funds.'));
  if (isLocalStorageBlocked()) {
    alert('Warning! Your browser is blocking access to the local storage. Please disable the protection and reload the page for UniLogin to work properly.');
  }

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

export const getOrCreateUlButton = (styles: Record<string, string> = {}) => {
  const element = document.getElementById('ul-btn') ?? createReactRoot('ul-btn');
  setStylesOnElement({
    ...defaultUlButtonStyle,
    ...styles,
  }, element);
  return element;
};

const defaultUlButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '30px',
};

const setStylesOnElement = (styles: Record<string, string>, element: HTMLElement) => {
  Object.assign(element.style, styles);
};

export function initPickerUi(props: IWeb3PickerComponentProps) {
  const root = createReactRoot('universal-login-web3-picker');
  render(<Web3PickerComponent {...props} />, root);
}
