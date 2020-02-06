import {ULWeb3Provider} from '../ULWeb3Provider';
import {RpcBridge} from './RpcBridge';

const universalLogin = ULWeb3Provider.getDefaultProvider('kovan');
universalLogin.init();

const bridge = new RpcBridge(
  msg => window.top.postMessage(msg, '*'),
  universalLogin.send.bind(universalLogin) as any,
);
window.addEventListener('message', e => bridge.handleMessage(e.data));
