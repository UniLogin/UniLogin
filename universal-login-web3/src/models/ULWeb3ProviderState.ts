export type ULWeb3ProviderState = {
  kind: 'IDLE';
} | {
  kind: 'ONBOARDING';
} | {
  kind: 'CONFIRMATION';
} | {
  kind: 'WAIT_FOR_TRANSACTION';
};
