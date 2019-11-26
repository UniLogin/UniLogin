import React from 'react';
import {IModalService, WaitingForTransactionProps} from '@universal-login/react';

export type WalletModalType =
  | 'error'
  | 'transfer'
  | 'waitingForTransfer'
  | 'none';

type ErrorMessageType = string;

export type WalletModalPropType = Partial<WaitingForTransactionProps> | ErrorMessageType;

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, WalletModalPropType>);
