export const PROXY_VERSIONS: Record<string, ProxyVersion> = {
  '0xb68afa7e9356b755f3d76e981adaa503336f60df29b28c0a8013c17cecb750bb': 'WalletProxy',
  '0xaea7d4252f6245f301e540cfbee27d3a88de543af8e49c5c62405d5499fab7e5': 'GnosisSafe',
};

export type ProxyVersion = 'WalletProxy' | 'GnosisSafe';
