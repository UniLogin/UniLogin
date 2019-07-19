import React from 'react';
import {Spinner} from '@universal-login/react';

export const renderBusyIndicator = (busy: boolean) =>
  busy ?
    <Spinner className={'spinner-busy-indicator'}/> :
    null;
