import {Network} from './models/network';

export function buildIframeUrl(
  iframeUrl: string,
  picker: boolean,
  sdkConfig: Record<string, any>,
  disabledDialogs: string[],
  network?: Network,
): string {
  const query = encodeQuery({
    picker,
    network,
    sdkConfig: JSON.stringify(sdkConfig),
    disabledDialogs,
  });
  return `${iframeUrl}?${query}`;
}

function encodeQuery(query: Record<string, string | number | boolean | undefined | string[]>) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value?.toString() ?? '')}`)
    .join('&');
}
