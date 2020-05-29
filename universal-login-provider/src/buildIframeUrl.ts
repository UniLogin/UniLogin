import {Network} from './models/network';
import {Dialogs} from './models/provider';

export function buildIframeUrl(
  iframeUrl: string,
  picker: boolean,
  sdkConfig: Record<string, any>,
  network?: Network,
  disabledDialogs?: Dialogs[],
): string {
  const query = encodeQuery({
    picker,
    network,
    sdkConfig: JSON.stringify(sdkConfig),
    disabledDialogs: JSON.stringify(disabledDialogs),
  });
  return `${iframeUrl}?${query}`;
}

function encodeQuery(query: Record<string, string | number | boolean | undefined>) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value?.toString() ?? '')}`)
    .join('&');
}
