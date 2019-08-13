import React from 'react';
import {IModalService} from '../services/createModalService';

export type ReactUModalType = 'funds' | 'approveDevice' | 'settings' | 'none';
export type ReactUModalProps = {

};
export const ReactUModalContext = React.createContext({} as IModalService<ReactUModalType, ReactUModalProps>);


