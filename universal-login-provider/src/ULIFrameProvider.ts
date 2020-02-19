import {RpcBridge} from './RpcBridge';
import {DEFAULT_CONFIG} from './config';
import {createIFrame} from './createIframe';
import {State, waitFor} from 'reactive-properties';
import {getApplicationInfoFromDocument} from './applicationInfo';
import {buildIframeUrl} from './buildIframeUrl';

export interface Provider {
  send: (msg: any, cb: (err: any, response: any) => void) => void;
}

export class ULIFrameProvider {
  private iframe: HTMLIFrameElement;
  private bridge: RpcBridge;
  private isReady = new State(false);
  private hasNotifications = new State(false);

  readonly isUniLogin = true;

  constructor(
    private readonly upstream: Provider,
    private readonly config = DEFAULT_CONFIG,
    enablePicker = false,
  ) {
    const applicationInfo = getApplicationInfoFromDocument();
    const iframeUrl = buildIframeUrl(config.backendUrl, applicationInfo, enablePicker);
    this.iframe = createIFrame(iframeUrl);
    this.bridge = new RpcBridge(
      msg => this.iframe.contentWindow!.postMessage(msg, '*'),
      this.handleRpc.bind(this),
    );
    window.addEventListener('message', e => this.bridge.handleMessage(e.data));

    this.observeDomForUlButtons();
  }

  private observeDomForUlButtons() {
    const mutationObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.target instanceof Element) {
          mutation.target.querySelectorAll(`button#${this.config.ulButtonId}`)
            .forEach(element => {
              if (element instanceof HTMLButtonElement) {
                this.initUlButton(element);
              }
            });
        }
      }
    });
    mutationObserver.observe(document.body, {childList: true, subtree: true});
  }

  private handleRpc(msg: any, cb: (error: any, response: any) => void) {
    switch (msg.method) {
      case 'ul_set_iframe_visibility':
        this.setIframeVisibility(msg.params[0]);
        break;
      case 'ul_ready':
        this.isReady.set(true);
        break;
      case 'ul_set_notification_indicator':
        this.hasNotifications.set(msg.params[0]);
        this.setNotificationsIndicator(this.hasNotifications.get());
        break;
      default:
        this.sendUpstream(msg, cb);
    }
  }

  private setNotificationsIndicator(hasNotifications: boolean) {
    const uniButton = document.getElementById(this.config.ulButtonId);
    if (uniButton) {
      const notificationIndicator = uniButton.getElementsByTagName('div')[0];
      this.setElementVisibility(notificationIndicator, hasNotifications);
    }
  }

  private sendUpstream(msg: any, cb: (error: any, response: any) => void) {
    if ((this.upstream as any).sendAsync) {
      (this.upstream as any).sendAsync(msg, cb);
    } else {
      this.upstream.send(msg, cb);
    }
  }

  private setIframeVisibility(visible: boolean) {
    this.iframe.style.display = visible ? 'unset' : 'none';
  }

  static create(upstream: Provider, config = DEFAULT_CONFIG) {
    return new ULIFrameProvider(upstream, config);
  }

  static createPicker(upstream: Provider, config = DEFAULT_CONFIG) {
    return new ULIFrameProvider(upstream, config, true);
  }

  async send(msg: any, cb: (error: any, response: any) => void) {
    await this.isReady.pipe(waitFor(Boolean));
    this.bridge.send(msg, cb);
  }

  setDashboardVisibility(visible: boolean) {
    this.send({method: 'ul_set_dashboard_visibility', params: [visible]}, () => {});
  }

  openDashboard() {
    this.setDashboardVisibility(true);
  }

  closeDashboard() {
    this.setDashboardVisibility(false);
  }

  private setElementVisibility = (element: HTMLDivElement, isVisible: boolean) => {
    element.style.display = isVisible ? 'block' : 'none';
  };

  private boundOpenDashboard = this.openDashboard.bind(this);

  initUlButton(element: HTMLButtonElement) {
    Object.assign(element.style, {
      display: 'inline-block',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      width: '60px',
      height: '60px',
    });

    element.innerHTML = `
      <img src="${this.config.logoUrl}" alt="U" >
      <div></div>
    `;
    const notificationIndicator = element.getElementsByTagName('div')[0];
    Object.assign(notificationIndicator.style, {
      display: this.hasNotifications.get() ? 'block' : 'none',
      position: 'absolute',
      top: '0px',
      right: '0px',
      width: '15px',
      height: '15px',
      background: '#0FB989',
      'box-shadow': '0px 5px 4px rgba(0, 0, 0, 0.14516)',
      'border-radius': '50%',
    });

    element.addEventListener('click', this.boundOpenDashboard);
  }
}
