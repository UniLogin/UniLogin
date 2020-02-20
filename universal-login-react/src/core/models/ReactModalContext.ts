import React from 'react';
import {IModalService, ShowModal} from '../services/useModalService';
import UniversalLoginSDK, {WalletService} from '@unilogin/sdk';

export type ReactModalType =
  | 'connectionFlow';

export type ReactModalProps = ConnectionFlowProps;

export type ConnectionFlowProps = {
  name: string;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onSuccess: () => void;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);

export type ShowReactModal = ShowModal<ReactModalType, ReactModalProps>;
