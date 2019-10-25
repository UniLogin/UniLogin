import React from 'react';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {TopUpProviderSupportService} from '../../core/services/TopUpProviderSupportService';

interface PayButtonProps {
  amount: string;
  onClick: (topUpProvider: TopUpProvider, amount: string) => void;
  paymentMethod?: TopUpProvider;
  topUpProviderSupportService: TopUpProviderSupportService;
}

export const PayButton = ({onClick, amount, paymentMethod, topUpProviderSupportService}: PayButtonProps) => {
  const isPayButtonDisabled = !paymentMethod ||
    (topUpProviderSupportService.isInputAmountUsed(paymentMethod) && Number(amount) <= 0);
  return (
    <button
      onClick={() => onClick(paymentMethod!, amount)}
      className="pay-btn"
      disabled={isPayButtonDisabled}
    >
      Pay
    </button >
  );
};
