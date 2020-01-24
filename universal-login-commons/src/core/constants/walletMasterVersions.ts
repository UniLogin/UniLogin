export const WALLET_MASTER_VERSIONS: Record<string, WalletVersion> = {
  '0x0fc2be641158de5ed5cdbc4cec010c762bc74771e51b15432bb458addac3513d': 'beta1',
  '0x6575c72edecb8ce802c58b1c1b9cbb290ef2b27588b76c73302cb70b862702a7': 'beta2',
  '0x56b8be58b5ad629a621593a2e5e5e8e9a28408dc06e95597497b303902772e45': 'beta3',
};

export type WalletVersion = 'beta1' | 'beta2' | 'beta3';
