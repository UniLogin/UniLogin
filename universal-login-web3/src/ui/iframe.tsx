import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {raise, asNetwork} from '@unilogin/commons';
import {asSdkConfigOverrides} from '@unilogin/sdk';
import {parseQuery} from '@unilogin/react';
import {asBoolean, cast} from '@restless/sanitizers';
import {IframeBridgeEndpoint} from '../services/IframeBridgeEndpoint';

async function main() {
  const parsedQuery = parseQuery(window.location.search);
  const isPicker = cast(parsedQuery.picker, asBoolean);
  const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;
  const sdkConfig = cast(JSON.parse(parsedQuery.sdkConfig), asSdkConfigOverrides);
  const endpoint = new IframeBridgeEndpoint();
  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(endpoint, sdkConfig, network)
    : new ProviderOnlyIframeInitializer(endpoint, network ?? raise(new TypeError()), sdkConfig);

  await iframeInitializer.start();
}

main();
