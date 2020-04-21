import {Network} from './models/network';

export function buildIframeUrl(iframeUrl: string, applicationInfo: Record<string, any>, picker: boolean, network?: Network): string {
  const query = encodeQuery({
    applicationInfo: JSON.stringify(applicationInfo),
    picker,
    network,
  });
  return `${iframeUrl}?${query}`;
}

function encodeQuery(query: Record<string, string | number | boolean | undefined>) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value?.toString() ?? '')}`)
    .join('&');
}
