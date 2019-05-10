import React from 'react';

export const renderBusyIndicator = (busy: boolean) =>
  busy ?
    <div className="circle-loader input-loader"/> :
    null;