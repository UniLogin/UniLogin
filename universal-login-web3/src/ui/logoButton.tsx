import React from 'react';
import {render} from 'react-dom';
import {WalletService} from '@universal-login/sdk';
import {LogoButton} from '@universal-login/react';

export function renderLogoButton(element: Element, walletService: WalletService) {
  render(<LogoButton walletService={walletService}/>, element);
}
