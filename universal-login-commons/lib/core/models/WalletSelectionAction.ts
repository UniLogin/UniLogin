export enum WalletSelectionAction {
  'create',
  'connect',
  'recover'
}

export const WALLET_SELECTION_ALL_ACTIONS: WalletSelectionAction[] = [
  WalletSelectionAction.create,
  WalletSelectionAction.connect,
  WalletSelectionAction.recover
];
