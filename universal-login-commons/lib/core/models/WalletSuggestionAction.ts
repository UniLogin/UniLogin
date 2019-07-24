export enum WalletSuggestionAction {
  'create',
  'connect',
  'recover'
}

export const WALLET_SUGGESTION_ALL_ACTIONS: WalletSuggestionAction[] = [
  WalletSuggestionAction.create,
  WalletSuggestionAction.connect,
  WalletSuggestionAction.recover
];
