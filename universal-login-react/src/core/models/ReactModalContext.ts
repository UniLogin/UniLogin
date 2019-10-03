import React from 'react';
import {IPGeolocationApiConfig, OnGasParametersChanged, OnRampConfig} from '@universal-login/commons';
import {IModalService} from '../services/createModalService';
import UniversalLoginSDK from '@universal-login/sdk';

export type ReactModalType = 'topUpAccount' | 'topUp' | 'address' | 'waitingForDeploy' | 'waitingForTransfer' | 'safello';

export type ReactModalProps = TopUpProps;

export type TopUpProps = {
  sdk: UniversalLoginSDK
  contractAddress: string;
  onRampConfig: OnRampConfig;
  ipGeolocationApiConfig: IPGeolocationApiConfig;
  onGasParametersChanged: OnGasParametersChanged;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);
