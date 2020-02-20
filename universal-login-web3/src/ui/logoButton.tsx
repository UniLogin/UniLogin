import React from 'react';
import {render} from 'react-dom';
import {WalletService} from '@unilogin/sdk';
import {LogoButton} from '@unilogin/react';

export function renderLogoButton(element: Element, walletService: WalletService) {
  render(<LogoButton walletService={walletService}/>, element);
}
