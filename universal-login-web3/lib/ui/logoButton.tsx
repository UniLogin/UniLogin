import React from 'react';
import {render} from 'react-dom';
import {LogoButton, useProperty} from '@universal-login/react';
import {WalletService} from '@universal-login/sdk';

export interface LogoButtonRendererProps {
  walletService: WalletService;
}

const LogoButtonRenderer = ({walletService}: LogoButtonRendererProps) => {
  const walletState = useProperty(walletService.stateProperty);

  if (walletState.kind !== 'Deployed') {
    return null;
  }

  return <LogoButton deployedWallet={walletState.wallet}/>;
};

export function renderLogoButton(element: Element, services: LogoButtonRendererProps) {
  render(<LogoButtonRenderer {...services}/>, element);
}
