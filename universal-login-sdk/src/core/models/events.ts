export type WalletEventType = 'KeyAdded' | 'KeyRemoved';

export type WalletEventArgs = {
  key: string;
};

export type WalletEventFilter = {
  key: string;
  contractAddress: string;
};

export type WalletEventCallback = (args: WalletEventArgs) => void;

export type WalletEventObservableRecord = {
  key: string;
  callback: WalletEventCallback;
};
