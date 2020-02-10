import {ULWeb3Provider} from '../ULWeb3Provider';
import {RpcBridge} from '../services/RpcBridge';
import {forEach} from 'reactive-properties';
import {setupStrategies} from '../api/setupStrategies';
import {Web3PickerProvider} from '../Web3PickerProvider';
import Web3 from 'web3';
import {EMPTY_LOGO} from '@universal-login/commons';

function setIframeVisibility(bridge: RpcBridge, isVisible: boolean) {
  bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
}

function initProviderOnly() {
  const universalLogin = ULWeb3Provider.getDefaultProvider('kovan');
  universalLogin.init();

  const bridge = new RpcBridge(
    msg => window.top.postMessage(msg, '*'),
    universalLogin.send.bind(universalLogin) as any,
  );
  window.addEventListener('message', e => bridge.handleMessage(e.data));

  universalLogin.isUiVisible.pipe(forEach(
    isVisible => setIframeVisibility(bridge, isVisible),
  ));
}

function initPicker() {
  // eslint-disable-next-line prefer-const
  let web3PickerProvider: Web3PickerProvider;
  const bridge = new RpcBridge(
    msg => window.top.postMessage(msg, '*'),
    (req, cb) => {
      if (req.method) {
        web3PickerProvider.send(req, cb as any);
      } else {
        console.warn('Error ignored', req)
      }
    },
  );
  window.addEventListener('message', e => bridge.handleMessage(e.data));
  const web3 = new Web3(bridge);
  const applicationInfo = {applicationName: 'Embeded', logo: EMPTY_LOGO, type: 'laptop'}; // TODO: get from query
  const web3ProviderFactories = setupStrategies(web3, ['Metamask', 'UniLogin'], {applicationInfo});
  web3PickerProvider = new Web3PickerProvider(web3ProviderFactories, bridge);

  web3PickerProvider.isVisible.pipe(forEach(isVisible => setIframeVisibility(bridge, isVisible)));
  web3PickerProvider.currentProvider.pipe(forEach(provider => {
    if ((provider as any)?.isUniversalLogin) {
      return (provider as ULWeb3Provider).isUiVisible.pipe(forEach(isVisible => setIframeVisibility(bridge, isVisible)));
    }
  }));
}

if (window.location.search.includes('picker')) {
  initPicker();
} else {
  initProviderOnly();
}
