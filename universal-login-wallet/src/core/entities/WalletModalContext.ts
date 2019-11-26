import React from 'react';
import {IModalService, ShowModal, WaitingForTransactionProps, WaitingForOnRampProviderProps} from '@universal-login/react';
import {OnGasParametersChanged} from '@universal-login/commons';

export type WalletModalType =
  | 'error'
  | 'transfer'
  | 'topUpAccount'
  | 'waitingForDeploy'
  | 'waitingForTransfer'
  | 'none';

export interface TopUpModalProps {
  onGasParametersChanged?: OnGasParametersChanged;
  isDeployment: boolean;
  hideModal?: () => void;
  showModal?: ShowModal<any, any>;
}

type ErrorMessageType = string;

export type WalletModalPropType = Partial<WaitingForTransactionProps> | TopUpModalProps | ErrorMessageType | WaitingForOnRampProviderProps;

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, WalletModalPropType>);
