import React from 'react';
import {OnGasParametersChanged} from '@universal-login/commons';
import {IModalService} from '../services/createModalService';
import UniversalLoginSDK from '@universal-login/sdk';
import {WaitingForProps} from '../../ui/commons/WaitingFor';

export type ReactModalType = 'topUpAccount' | 'topUp' | 'address' | 'waitingFor' | 'safello';

export type ReactModalProps = TopUpProps | WaitingForProps;

export type TopUpProps = {
  sdk: UniversalLoginSDK
  contractAddress: string;
  onGasParametersChanged: OnGasParametersChanged;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);
