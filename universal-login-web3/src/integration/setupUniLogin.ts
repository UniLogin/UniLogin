import {ULWeb3Provider} from '../ULWeb3Provider';

interface CreateOverrides {
  network: string;
}

export const setupUniLogin = (applicationInfo: any, overrides?: CreateOverrides) => ({
  name: 'UniversalLogin',
  icon: 'UniversalLogin logo',
  create: async () => {
    const networkVersion = overrides?.network ? overrides.network : (window as any).web3.currentProvider.networkVersion;
    const provider = ULWeb3Provider.getDefaultProvider(networkVersion, applicationInfo);
    await provider.init();
    return provider;
  },
});
