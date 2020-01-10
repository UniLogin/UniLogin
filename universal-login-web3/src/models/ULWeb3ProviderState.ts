export type ULWeb3ProviderState = {
  kind: 'IDLE';
} | {
  kind: 'ONBOARDING';
} | {
  kind: 'CONFIRMATION';
  props: {
    onConfirmationResponse: (value: boolean) => void;
    title: string;
  };
} | {
  kind: 'WAIT_FOR_TRANSACTION';
  props: {
    transactionHash?: string;
  };
};
