import React from 'react';
import {IModalService} from '@universal-login/react';

export type WalletModalType = 'transfer' | 'transferRecipient' | 'request' | 'topUpAccount' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none';

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, void>);
