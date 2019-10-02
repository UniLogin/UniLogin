import React from 'react';
import {IModalService} from '@universal-login/react';
import {ModalWaitingForProps} from '../../ui/react/Modals/ModalWaitingFor';

export type WalletModalType = 'error' | 'transfer' | 'transferRecipient' | 'request' | 'topUpAccount' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none';

export type WalletModalPropType = Partial<ModalWaitingForProps>;

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, WalletModalPropType>);
