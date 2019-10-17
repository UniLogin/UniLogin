import React from 'react';
import {IModalService, WaitingForTransactionProps} from '@universal-login/react';
import {OnGasParametersChanged} from '@universal-login/commons';

export type WalletModalType = 'error' | 'transfer' | 'transferRecipient' | 'request' | 'topUpAccount' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none';

export interface TopUpModalProps {
  onGasParametersChanged?: OnGasParametersChanged;
  isDeployment: boolean;
  hideModal?: () => void;
}

type ErrorMessageType = string;

export type WalletModalPropType = Partial<WaitingForTransactionProps> | TopUpModalProps | ErrorMessageType;

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, WalletModalPropType>);
