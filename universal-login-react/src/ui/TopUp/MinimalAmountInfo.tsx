import React from 'react';

interface MinimalAmountInfoProps {
  minimalAmount?: string;
  isFiatMethod?: boolean;
};

export const MinimalAmountInfo = ({minimalAmount, isFiatMethod}: MinimalAmountInfoProps) => {
  const fiatTopUpMinimalAmountInfo = () =>
    <p className="info-text info-text-hint">Send {minimalAmount || '...'} ETH to this address</p>;

  const cryptoTopUpMinimalAmountInfo = () => (
    <>
      <p className="info-text">Send {minimalAmount || '...'} ETH to this address</p>
      <p className="info-text">This screen will update itself as soon as we detect a mined transaction</p>
    </>
  );

  return (
    isFiatMethod
      ? fiatTopUpMinimalAmountInfo()
      : cryptoTopUpMinimalAmountInfo()
  );
};
