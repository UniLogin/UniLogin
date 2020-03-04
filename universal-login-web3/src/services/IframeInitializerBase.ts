import {forEach, Property} from 'reactive-properties';
import {IframeBridgeEndpoint} from './IframeBridgeEndpoint';

export abstract class IframeInitializerBase {
  constructor(
    protected readonly endpoint: IframeBridgeEndpoint,
  ) {}

  protected abstract getIsUiVisible(): Property<boolean>;

  protected abstract getHasNotifications(): Property<boolean>;

  async start() {
    this.getIsUiVisible().pipe(forEach(
      isVisible => this.endpoint.setIframeVisibility(isVisible),
    ));

    this.getHasNotifications().pipe(forEach(
      hasNotifications => this.endpoint.setNotificationIndicator(hasNotifications),
    ));
  }

  ready() {
    this.endpoint.sendReadySignal();
  }
}
