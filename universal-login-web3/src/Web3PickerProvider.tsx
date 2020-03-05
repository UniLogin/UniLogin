import {Callback, JsonRPCRequest, JsonRPCResponse, Provider} from 'web3/providers';
import {Web3ProviderFactory} from './models/Web3ProviderFactory';
import {State} from 'reactive-properties';
import {ensureNotFalsy} from '@unilogin/commons';
import {InvalidProvider} from './ui/utils/errors';
import {initPickerUi} from './ui/initUi';
import {waitForFalse} from './ui/utils/utils';
import {ULWeb3Provider, methodsRequiringAccount} from './ULWeb3Provider';

export class Web3PickerProvider implements Provider {
  readonly currentProvider = new State<Provider | undefined>(undefined);
  providerName = 'Web3Picker';

  readonly isVisible = new State(false);
  private reactRootCreated = false;

  constructor(
    public readonly factories: Web3ProviderFactory[],
    public readonly readProvider: Provider,
    private readonly uiInitializer = initPickerUi,
  ) { }

  async send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    if (!this.currentProvider.get()) {
      if (!methodsRequiringUlProvider.includes(payload.method)) {
        return this.readProvider.send(payload, callback);
      }
      if (payload.method === 'eth_accounts') {
        callback(null, {jsonrpc: '2.0', id: payload.id, result: []});
      }
      if (this.isVisible.get()) {
        return;
      }
      if (!await this.show()) {
        return;
      }
    }
    const provider = this.currentProvider.get();
    ensureNotFalsy(provider, TypeError);
    return provider.send(payload, callback);
  }

  async setProvider(providerName: string) {
    const factory = this.factories.find((factory) => factory.name === providerName);
    ensureNotFalsy(factory, InvalidProvider, providerName);
    const provider = await factory.create();
    this.currentProvider.set(provider);
    this.providerName = providerName;
    this.isVisible.set(false);
    if (factory.name === 'UniLogin') {
      await (provider as ULWeb3Provider).init();
    }
  }

  private lazyCreateReactRoot() {
    if (!this.reactRootCreated) {
      this.reactRootCreated = true;
      this.uiInitializer({
        isVisibleProp: this.isVisible,
        hideModal: () => this.isVisible.set(false),
        setProvider: this.setProvider.bind(this),
        factories: this.factories,
      });
    }
  }

  async show() {
    this.lazyCreateReactRoot();
    this.isVisible.set(true);
    await waitForFalse(this.isVisible);
    return !!this.currentProvider.get();
  }
}

const methodsRequiringUlProvider = [
  ...methodsRequiringAccount,
  'eth_accounts',
];
