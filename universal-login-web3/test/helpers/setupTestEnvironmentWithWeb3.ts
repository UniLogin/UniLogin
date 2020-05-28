import {setupTestEnvironment} from './setupTestEnvironment';
import Web3 from 'web3';
import {Provider} from 'web3/providers';
import {MemoryStorageService} from '@unilogin/sdk';
import {ULWeb3RootProps} from '../../src/ui/react/ULWeb3Root';
import {ULWeb3Provider} from '../../src/ULWeb3Provider';
import {BrowserChecker} from '@unilogin/react';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';

const mockedBrowserChecker = {
  isLocalStorageBlocked: () => false,
} as BrowserChecker;

function createProvider(provider: Provider, relayerUrl: string): [ULWeb3Provider, ULWeb3RootProps] {
  let services: ULWeb3RootProps;
  const ulProvider = new ULWeb3Provider({
    network: 'ganache',
    provider,
    relayerUrl,
    ensDomains: ['mylogin.eth'],
    observedTokensAddresses: [ETHER_NATIVE_TOKEN.address],
    sdkConfigOverrides: {
      storageService: new MemoryStorageService(),
    },
    uiInitializer: (props: ULWeb3RootProps) => {
      services = props;
    },
    browserChecker: mockedBrowserChecker,
  });
  return [ulProvider, services!];
}

export async function setupTestEnvironmentWithWeb3() {
  const {relayer, deployer, provider, wallets} = await setupTestEnvironment();

  const [ulProvider, services] = createProvider(provider._web3Provider as any, relayer.url());
  await ulProvider.init();
  const web3 = new Web3(ulProvider);
  web3.eth.defaultAccount = `0x${'00'.repeat(20)}`;

  return {relayer, deployer, provider, wallets, ulProvider, services, web3};
}
