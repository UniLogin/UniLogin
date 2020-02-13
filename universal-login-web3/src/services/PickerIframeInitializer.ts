import {Web3PickerProvider} from '../Web3PickerProvider';
import {RpcBridge} from './RpcBridge';
import {setupStrategies} from '../api/setupStrategies';
import {combine, flat, forEach, map, State} from 'reactive-properties';
import {ULWeb3Provider} from '../ULWeb3Provider';
import {EMPTY_LOGO} from '@universal-login/commons';

export class PickerIframeInitializer {

  setIframeVisibility(bridge: RpcBridge, isVisible: boolean) {
    bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
  }

  sendReadySignal(bridge: RpcBridge) {
    bridge.send({method: 'ul_ready'}, () => {});
  }
  init() {
    // eslint-disable-next-line prefer-const
    let web3PickerProvider: Web3PickerProvider;
    const bridge = new RpcBridge(
      msg => window.top.postMessage(msg, '*'),
      (req, cb) => web3PickerProvider.send(req, cb as any),
    );
    window.addEventListener('message', e => bridge.handleMessage(e.data));
    const applicationInfo = {applicationName: 'Embeded', logo: EMPTY_LOGO, type: 'laptop'}; // TODO: get from query
    const web3ProviderFactories = setupStrategies(bridge, ['Metamask', 'UniLogin'], {applicationInfo});
    web3PickerProvider = new Web3PickerProvider(web3ProviderFactories, bridge);

    const isUiVisible = combine([
      web3PickerProvider.isVisible,
      web3PickerProvider.currentProvider.pipe(
        map(provider => provider instanceof ULWeb3Provider ? provider.isUiVisible : new State(false)),
        flat,
      ),
    ], (a, b) => a || b);
    isUiVisible.pipe(forEach(
      isVisible => this.setIframeVisibility(bridge, isVisible),
    ));

    this.sendReadySignal(bridge);
  }

}
