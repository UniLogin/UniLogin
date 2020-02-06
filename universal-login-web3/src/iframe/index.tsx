import {ULWeb3Provider} from '../ULWeb3Provider';
import {RpcBridge} from './RpcBridge';
import {forEach} from 'reactive-properties';

const universalLogin = ULWeb3Provider.getDefaultProvider('kovan');
universalLogin.init();

const bridge = new RpcBridge(
  msg => window.top.postMessage(msg, '*'),
  universalLogin.send.bind(universalLogin) as any,
);
window.addEventListener('message', e => bridge.handleMessage(e.data));

universalLogin.isUiVisible.pipe(forEach(
  isVisible => bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {}),
));
