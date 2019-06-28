import React from 'react';
import Spinner from '../Login/Spinner';

export const renderBusyIndicator = (busy: boolean) =>
  busy ?
    <Spinner className={"spinner-busy-indicator"}/> :
    null;
