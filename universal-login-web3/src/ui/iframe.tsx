import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo, raise, asNetwork} from '@unilogin/commons';
import {asSdkConfigOverrides} from '@unilogin/sdk';
import {parseQuery} from '@unilogin/react';
import {asBoolean, cast} from '@restless/sanitizers';
import {IframeBridgeEndpoint} from '../services/IframeBridgeEndpoint';

async function main() {
  const parsedQuery = parseQuery(window.location.search);
  const isPicker = cast(parsedQuery.picker, asBoolean);
  const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);
  const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;
  const sdkConfig = cast(JSON.parse(parsedQuery.sdkConfig), asSdkConfigOverrides);
  const endpoint = new IframeBridgeEndpoint();
  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(endpoint, applicationInfo, network)
    : new ProviderOnlyIframeInitializer(endpoint, network ?? raise(new TypeError()), applicationInfo);

  await iframeInitializer.start();
}

main();
