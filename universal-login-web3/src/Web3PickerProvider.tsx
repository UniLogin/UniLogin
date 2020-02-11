import {Callback, JsonRPCRequest, JsonRPCResponse, Provider} from 'web3/providers';
import {Web3ProviderFactory} from './models/Web3ProviderFactory';
import {State} from 'reactive-properties';
import {ensureNotFalsy} from '@universal-login/commons';
import {InvalidProvider} from './ui/utils/errors';
import {initPickerUi} from './ui/initUi';
import {waitForFalse} from './ui/utils/utils';

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
      if (!isAccountDependantRpc(payload.method)) {
        return this.readProvider.send(payload, callback);
      }
      if (this.isVisible.get()) {
        return;
      }
      if (payload.method === 'eth_accounts') {
        return callback(null, {
          jsonrpc: payload.jsonrpc,
          id: payload.id,
          result: [],
        });
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
    this.currentProvider.set(await factory.create());
    this.providerName = providerName;
    this.isVisible.set(false);
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

const isAccountDependantRpc = (method: string) => [
  'eth_sendTransaction',
  'eth_sendRawTransaction',
  'eth_accounts',
  'eth_sign',
  'personal_sign',
  'ul_set_dashboard_visibility',
  'eth_requestAccounts',
].includes(method);
