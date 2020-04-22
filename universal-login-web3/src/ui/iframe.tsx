import {asBoolean, cast} from '@restless/sanitizers';
import {raise, asNetwork, asApplicationInfo} from '@unilogin/commons';
import {asSdkConfigOverrides, SdkConfig} from '@unilogin/sdk';
import {parseQuery} from '@unilogin/react';
import {MissingParameter} from './utils/errors';
import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {IframeBridgeEndpoint} from '../services/IframeBridgeEndpoint';

const getSdkConfig = (applicationInfo?: string, sdkConfig?: string): Partial<SdkConfig> => {
  if (applicationInfo) {
    return {applicationInfo: cast(JSON.parse(applicationInfo), asApplicationInfo)};
  } else {
    if (!sdkConfig) throw new MissingParameter('sdkConfig');
    return cast(JSON.parse(sdkConfig), asSdkConfigOverrides);
  };
};

async function main() {
  const parsedQuery = parseQuery(window.location.search);
  const isPicker = cast(parsedQuery.picker, asBoolean);
  const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;
  const sdkConfig = getSdkConfig(parsedQuery.applicationInfo, parsedQuery.sdkConfig);
  const endpoint = new IframeBridgeEndpoint();
  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(endpoint, sdkConfig, network)
    : new ProviderOnlyIframeInitializer(endpoint, network ?? raise(new TypeError()), sdkConfig);

  await iframeInitializer.start();
}

main();
