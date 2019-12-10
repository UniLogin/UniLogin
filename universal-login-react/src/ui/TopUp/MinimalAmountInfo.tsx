import React from 'react';

interface MinimalAmountInfoProps {
  minimalAmount?: string;
  isFiatMethod?: boolean;
};

export const MinimalAmountInfo = ({minimalAmount, isFiatMethod}: MinimalAmountInfoProps) => {
  const getHintStyle = () => isFiatMethod ? 'info-text info-text-hint' : 'info-text';

  return (
    <>
      <p className={getHintStyle()}>Send {minimalAmount || '...'} ETH to this address</p>
      {!isFiatMethod &&
        <p className={getHintStyle()}>This screen will update itself as soon as we detect a mined transaction</p>
      }
    </>
  );
};
