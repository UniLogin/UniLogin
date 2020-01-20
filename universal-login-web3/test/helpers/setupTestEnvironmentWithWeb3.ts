import {setupTestEnvironment} from './setupTestEnvironment';
import Web3 from 'web3';
import {Provider} from 'web3/providers';
import {ULWeb3Provider} from '../../src';
import {ULWeb3RootProps} from '../../src/ui/react/ULWeb3Root';
import {MemoryStorageService} from '@universal-login/react';

function createProvider(provider: Provider, relayerUrl: string): [ULWeb3Provider, ULWeb3RootProps] {
  let services: ULWeb3RootProps;
  const ulProvider = new ULWeb3Provider({
    provider,
    relayerUrl,
    ensDomains: ['mylogin.eth'],
    uiInitializer: (props: ULWeb3RootProps) => {
      services = props;
    },
    storageService: new MemoryStorageService(),
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
