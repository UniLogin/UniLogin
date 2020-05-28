import {ExtendedConfig} from './ULIFrameProvider';

export function buildIframeUrl(
  sdkConfig: Record<string, any>,
  configOverrides: ExtendedConfig,
): string {
  const query = encodeQuery({
    transactionDialogs: configOverrides.showWaitingForTransaction,
    picker: configOverrides.enablePicker,
    network: configOverrides.network,
    sdkConfig: JSON.stringify(sdkConfig),
  });
  return `${configOverrides.backendUrl}?${query}`;
}

function encodeQuery(query: Record<string, string | number | boolean | undefined>) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value?.toString() ?? '')}`)
    .join('&');
}
