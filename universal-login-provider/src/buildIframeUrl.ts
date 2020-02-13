export function buildIframeUrl(iframeUrl: string, applicationInfo: Record<string, any>, picker: boolean): string {
  return iframeUrl + '?' + encodeQuery({applicationInfo: JSON.stringify(applicationInfo), picker});
}

function encodeQuery(query: Record<string, string | number | boolean>) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
    .join('&');
}
