export const PROXY_VERSIONS: Record<string, ProxyVersion> = {
  '0xb68afa7e9356b755f3d76e981adaa503336f60df29b28c0a8013c17cecb750bb': 'WalletProxy',
  '0x4813c27e2c8529dc3660fb191e46372147d8c3b2abde66530cd622f069138487': 'GnosisSafe',
  '0xaea7d4252f6245f301e540cfbee27d3a88de543af8e49c5c62405d5499fab7e5': 'GnosisSafe', // Copied from etherscan
};

export type ProxyVersion = 'WalletProxy' | 'GnosisSafe';
