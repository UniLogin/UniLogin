import React from 'react';

export const Wallet = () => {
  return <div>
    { window.localStorage.getItem('wallet') }
  </div>;
};
