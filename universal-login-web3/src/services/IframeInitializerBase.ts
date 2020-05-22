import {forEach, Property} from 'reactive-properties';
import {IframeBridgeEndpoint} from './IframeBridgeEndpoint';

export abstract class IframeInitializerBase {
  constructor(
    protected readonly endpoint: IframeBridgeEndpoint,
  ) {}

  protected abstract getIsUiVisible(): Property<boolean>;

  protected abstract getHasNotifications(): Property<boolean>;

  async start() {
    console.log('START before getISUIVISIBLE');
    this.getIsUiVisible().pipe(forEach(
      isVisible => this.endpoint.setIframeVisibility(isVisible),
    ));

    console.log('START before getHASNOTI');
    this.getHasNotifications().pipe(forEach(
      hasNotifications => this.endpoint.setNotificationIndicator(hasNotifications),
    ));
  }

  ready() {
    console.log('setReady func');
    this.endpoint.sendReadySignal();
  }
}
