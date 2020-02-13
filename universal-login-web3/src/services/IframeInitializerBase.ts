import {RpcBridge} from './RpcBridge';

export abstract class IframeInitializerBase {
  setIframeVisibility(bridge: RpcBridge, isVisible: boolean) {
    bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
  }

  sendReadySignal(bridge: RpcBridge) {
    bridge.send({method: 'ul_ready'}, () => {});
  }
}
