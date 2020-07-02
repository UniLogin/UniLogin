import React from 'react';
import {render} from 'react-dom';
import {WalletService} from '@unilogin/sdk';
import {Dashboard} from '@unilogin/react';

export function renderLogoButton(element: Element, walletService: WalletService) {
  render(<Dashboard walletService={walletService}/>, element);
}
