import {ULWeb3Provider} from '../ULWeb3Provider';
import {RpcBridge} from '../services/RpcBridge';
import {combine, flat, forEach, map, State} from 'reactive-properties';
import {setupStrategies} from '../api/setupStrategies';
import {Web3PickerProvider} from '../Web3PickerProvider';
import {EMPTY_LOGO} from '@universal-login/commons';

function setIframeVisibility(bridge: RpcBridge, isVisible: boolean) {
  bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
}

function sendReadySignal(bridge: RpcBridge) {
  bridge.send({method: 'ul_ready'}, () => {});
}

async function initProviderOnly() {
  const universalLogin = ULWeb3Provider.getDefaultProvider('kovan');
  await universalLogin.init();

  const bridge = new RpcBridge(
    msg => window.top.postMessage(msg, '*'),
    universalLogin.send.bind(universalLogin) as any,
  );
  window.addEventListener('message', e => bridge.handleMessage(e.data));

  universalLogin.isUiVisible.pipe(forEach(
    isVisible => setIframeVisibility(bridge, isVisible),
  ));

  sendReadySignal(bridge);
}

function initPicker() {
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
    isVisible => setIframeVisibility(bridge, isVisible),
  ));

  sendReadySignal(bridge);
}

if (window.location.search.includes('picker')) {
  initPicker();
} else {
  initProviderOnly();
}
