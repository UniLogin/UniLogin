import {RpcBridge} from './RpcBridge';
import {Provider} from 'web3/providers';
import {forEach, Property} from 'reactive-properties';

export abstract class IframeInitializerBase {
  protected readonly bridge: RpcBridge;

  constructor() {
    this.bridge = new RpcBridge(
      msg => window.top.postMessage(msg, '*'),
      (req, cb) => this.getProvider().send(req, cb as any),
    );
    window.addEventListener('message', e => this.bridge.handleMessage(e.data));
  }

  protected abstract getProvider(): Provider;

  protected abstract getIsUiVisible(): Property<boolean>;

  protected abstract getHasNotifications(): Property<boolean>;

  async start() {
    this.getIsUiVisible().pipe(forEach(
      isVisible => this.setIframeVisibility(isVisible),
    ));

    this.getHasNotifications().pipe(forEach(
      hasNotifications => this.setNotificationIndicator(hasNotifications),
    ));

    this.sendReadySignal();
  }

  private setNotificationIndicator(hasNotifications: boolean) {
    this.bridge.send({method: 'ul_set_notification_indicator', params: [hasNotifications]}, () => {});
  }

  private setIframeVisibility(isVisible: boolean) {
    this.bridge.send({method: 'ul_set_iframe_visibility', params: [isVisible]}, () => {});
  }

  private sendReadySignal() {
    this.bridge.send({method: 'ul_ready'}, () => {});
  }
}
