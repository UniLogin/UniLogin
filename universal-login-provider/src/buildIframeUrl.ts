import {Network} from './models/network';

export function buildIframeUrl(
  sdkConfig: Record<string, any>,
  configOverrides?: any,
  network?: Network,
): string {
  const query = encodeQuery({
    ...configOverrides,
    network,
    sdkConfig: JSON.stringify(sdkConfig),
  });
  return `${configOverrides.iframeUrl}?${query}`;
}

function encodeQuery(query: Record<string, string | number | boolean | undefined>) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value?.toString() ?? '')}`)
    .join('&');
}
