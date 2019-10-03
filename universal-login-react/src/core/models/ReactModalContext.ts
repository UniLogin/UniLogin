import React from 'react';
import {OnGasParametersChanged} from '@universal-login/commons';
import {IModalService} from '../services/createModalService';
import UniversalLoginSDK from '@universal-login/sdk';

export type ReactModalType = 'topUpAccount' | 'topUp' | 'address' | 'waitingForDeploy' | 'waitingForTransfer' | 'safello';

export type ReactModalProps = TopUpProps;

export type TopUpProps = {
  sdk: UniversalLoginSDK
  contractAddress: string;
  onGasParametersChanged: OnGasParametersChanged;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);
