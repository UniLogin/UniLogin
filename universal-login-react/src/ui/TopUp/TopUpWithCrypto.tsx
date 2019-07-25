import React from 'react';

interface TopUpWithCryptoProps {
  contractAddress: string;
}

export const TopUpWithCrypto = ({contractAddress}: TopUpWithCryptoProps) => {
  return(<div> Transfer crypto to your wallet: <span id="contract-address">{contractAddress}</span> </div>);
};
