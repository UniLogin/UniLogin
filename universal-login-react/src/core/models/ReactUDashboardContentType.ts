export type DashboardContentType = 'funds' | 'topup' | 'transferAmount' | 'transferRecipient' | 'waitingForTransfer' | 'devices' | 'backup' | 'none';

export type DashboardOptionalArgs = {
  message?: string;
  transactionHash?: string;
  error?: string;
};
