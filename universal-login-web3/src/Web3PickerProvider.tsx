import {Callback, JsonRPCRequest, JsonRPCResponse, Provider} from 'web3/providers';
import {Web3ProviderFactory} from './models/Web3ProviderFactory';
import {State} from 'reactive-properties';
import {ensureNotFalsy} from '@universal-login/commons';
import {InvalidProvider} from './ui/utils/errors';
import {initPickerUi} from './ui/utils/initUi';
import {waitForFalse} from './ui/utils/utils';

export class Web3PickerProvider implements Provider {
  currentProvider?: Provider;
  providerName = 'Web3Picker';

  private readonly isVisible = new State(false);
  private reactRootCreated = false;

  constructor(
    public readonly factories: Web3ProviderFactory[],
    public readonly readProvider: Provider,
  ) {
  }

  async send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) {
    if (!this.currentProvider) {
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
      await this.show();
    }
    ensureNotFalsy(this.currentProvider, TypeError);
    return this.currentProvider.send(payload, callback);
  }

  async setProvider(providerName: string) {
    const factory = this.factories.find((factory) => factory.name === providerName);
    ensureNotFalsy(factory, InvalidProvider, providerName);
    this.currentProvider = await factory.create();
    this.providerName = providerName;
    this.isVisible.set(false);
  }

  private lazyCreateReactRoot() {
    if (!this.reactRootCreated) {
      this.reactRootCreated = true;
      initPickerUi({
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
  }
}

const isAccountDependantRpc = (method: string) => [
  'eth_sendTransaction',
  'eth_sendRawTransaction',
  'eth_accounts',
  'eth_sign',
  'personal_sign',
].includes(method);
