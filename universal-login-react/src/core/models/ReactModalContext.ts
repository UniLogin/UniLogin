import React from 'react';
import {IModalService} from '../services/createModalService';

export type ReactModalType = 'topUpAccount' | 'address' | 'waitingForDeploy' | 'waitingForTransfer' | 'safello';

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType>);
